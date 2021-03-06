var app = angular.module('metaController', []);

app.controller('metaController',['$scope','$http','$interval','i18nService','Utilidades','$routeParams','$window','$location','$route','uiGridConstants','$mdDialog',
		function($scope, $http, $interval,i18nService,$utilidades,$routeParams,$window,$location,$route,uiGridConstants,$mdDialog) {
			var mi=this;
			
			$window.document.title = 'SIGPRO - Metas';
			i18nService.setCurrentLang('es');
			mi.mostrarcargando=true;
			mi.metas = [];
			mi.meta;
			mi.mostraringreso=false;
			mi.esnueva = false;
			mi.totalMetas = 0;
			mi.paginaActual = 1;
			mi.numeroMaximoPaginas = $utilidades.numeroMaximoPaginas;
			mi.elementosPorPagina = $utilidades.elementosPorPagina;
			mi.metatipos = [];
			mi.metasunidades = [];
			
			mi.nombrePcp = "";
			mi.nombreTipoPcp = "";
			
			switch($routeParams.tipo){
				case "1": mi.nombreTipoPcp = "Proyecto"; break;
				case "2": mi.nombreTipoPcp = "Componente"; break;
				case "3": mi.nombreTipoPcp = "Producto"; break;
			}
			
			$http.post('/SMeta', { accion: 'getPcp', id: $routeParams.id, tipo: $routeParams.tipo }).success(
					function(response) {
						mi.nombrePcp = response.nombre;
			});
			
			$http.post('/SMeta', { accion: 'getMetasTipos' }).success(
					function(response) {
						mi.metatipos = response.MetasTipos;
			});
			
			$http.post('/SMeta', { accion: 'getMetasUnidadesMedida' }).success(
					function(response) {
						mi.metaunidades = response.MetasUnidades;
			});
			
			mi.gridOptions = {
					enableRowSelection : true,
					enableRowHeaderSelection : false,
					multiSelect: false,
					modifierKeysToMultiSelect: false,
					noUnselect: true,
					enableFiltering: true,
					enablePaginationControls: false,
				    paginationPageSize: $utilidades.elementosPorPagina,
					columnDefs : [ 
						{ name: 'id', width: 100, displayName: 'ID', cellClass: 'grid-align-right', type: 'number', enableFiltering: false },
						{ name: 'nombre', width: 200, displayName: 'Nombre',cellClass: 'grid-align-left' },
					    { name: 'descripcion', displayName: 'Descripción', cellClass: 'grid-align-left', enableFiltering: false},
					    { name: 'unidadMedidaNombre', displayName: 'Unidad Medida', cellClass: 'grid-align-left', enableFiltering: false},
					    { name: 'tipoMetaNombre', displayName: 'Tipo Meta', cellClass: 'grid-align-left', enableFiltering: false},
					    { name: 'usuarioCreo', displayName: 'Usuario Creación'},
					    { name: 'fechaCreacion', displayName: 'Fecha Creación', cellClass: 'grid-align-right', type: 'date', cellFilter: 'date:\'dd/MM/yyyy\''}
					],
					onRegisterApi: function(gridApi) {
						mi.gridApi = gridApi;
						gridApi.selection.on.rowSelectionChanged($scope,function(row) {
							mi.meta = row.entity;
						});
						
						if($routeParams.reiniciar_vista=='rv'){
							mi.guardarEstado();
					    }
					    else{
					    	  $http.post('/SEstadoTabla', { action: 'getEstado', grid:'metas', t: (new Date()).getTime()}).then(function(response){
						      if(response.data.success && response.data.estado!='')
						    	  mi.gridApi.saveState.restore( $scope, response.data.estado);
						    	  mi.gridApi.colMovable.on.columnPositionChanged($scope, mi.guardarEstado);
							      mi.gridApi.colResizable.on.columnSizeChanged($scope, mi.guardarEstado);
							      mi.gridApi.core.on.columnVisibilityChanged($scope, mi.guardarEstado);
							      mi.gridApi.core.on.sortChanged($scope, mi.guardarEstado);
							  });
					    }
					}
				};
			
			mi.cargarTabla = function(pagina){
				mi.mostrarcargando=true;
				$http.post('/SMeta', { accion: 'getMetasPagina', pagina: pagina, numerometas: $utilidades.elementosPorPagina, 
					id: $routeParams.id, tipo: $routeParams.tipo }).success(
						function(response) {
							mi.metas = response.Metas;
							mi.gridOptions.data = mi.metas;
							mi.mostrarcargando = false;
						});
			}
			
			mi.guardar=function(){
				if(mi.meta!=null && mi.meta.nombre!='' && mi.meta.tipoMetaId>0 && mi.meta.unidadMedidaId>0 ){
					$http.post('/SMeta', {
						accion: 'guardarMeta',
						esnueva: mi.esnueva,
						id: mi.meta.id,
						nombre: mi.meta.nombre,
						descripcion: mi.meta.descripcion,
						tipometaid:  mi.meta.tipometaid,
						unidadmetaid: mi.meta.unidadmetaid,
						proyecto: ($routeParams.tipo==1) ? $routeParams.id : null,
						componente: ($routeParams.tipo==2) ? $routeParams.id : null,
						producto: ($routeParams.tipo==3) ? $routeParams.id : null
					}).success(function(response){
						if(response.success){
							$utilidades.mensaje('success','Meta '+(mi.esnueva ? 'creada' : 'guardada')+' con éxito');
							mi.cargarTabla();
						}
						else
							$utilidades.mensaje('danger','Error al '+(mi.esnueva ? 'crear' : 'guardar')+' la Meta');
					});
				}
				else
					$utilidades.mensaje('warning','Debe de llenar todos los campos obligatorios');
			};

			mi.borrar = function(ev) {
				if(mi.meta!=null){
					var confirm = $mdDialog.confirm()
				          .title('Confirmación de borrado')
				          .textContent('¿Desea borrar la Meta "'+mi.meta.nombre+'"?')
				          .ariaLabel('Confirmación de borrado')
				          .targetEvent(ev)
				          .ok('Borrar')
				          .cancel('Cancelar');
	
				    $mdDialog.show(confirm).then(function() {
				    	$http.post('/SMeta', {
							accion: 'borrarMeta',
							id: mi.meta.id
						}).success(function(response){
							if(response.success){
								$utilidades.mensaje('success','Meta borrada con éxito');
								mi.cargarTabla();
							}
							else
								$utilidades.mensaje('danger','Error al borrar la Meta');
						});
				    }, function() {
				    
				    });
				}
				else
					$utilidades.mensaje('warning','Debe seleccionar la Meta que desea borrar');
			};

			mi.nueva = function() {
				mi.mostraringreso=true;
				mi.esnueva = true;
				mi.cooperante = null;
				mi.gridApi.selection.clearSelectedRows();
			};

			mi.editar = function() {
				if(mi.meta!=null){
					mi.mostraringreso = true;
					mi.esnueva = false;
				}
				else
					$utilidades.mensaje('warning','Debe seleccionar la Meta que desea editar');
			}

			mi.irATabla = function() {
				mi.mostraringreso=false;
			}
			
			mi.guardarEstado=function(){
				var estado = mi.gridApi.saveState.save();
				var tabla_data = { action: 'guardaEstado', grid:'metas', estado: JSON.stringify(estado), t: (new Date()).getTime() }; 
				$http.post('/SEstadoTabla', tabla_data).then(function(response){
					
				});
			}
			
			mi.cambioPagina=function(){
				mi.cargarTabla(mi.paginaActual);
			}
			
			mi.reiniciarVista=function(){
				if($location.path()=='/metas/rv')
					$route.reload();
				else
					$location.path('/metas/rv');
			}
			
			$http.post('/SMeta', { accion: 'numeroMetas' }).success(
					function(response) {
						mi.totalMetas = response.totalmetas;
						mi.cargarTabla(1);
					});
			
		} ]);