var app = angular.module('desembolsotipoController', []);

app.controller('desembolsotipoController',['$scope','$http','$interval','i18nService','Utilidades','$routeParams','$window','$location','$route','uiGridConstants','$mdDialog',
		function($scope, $http, $interval,i18nService,$utilidades,$routeParams,$window,$location,$route,uiGridConstants,$mdDialog) {
			var mi=this;
			
			$window.document.title = 'SIGPRO - Tipo Desembolso';
			i18nService.setCurrentLang('es');
			mi.mostrarcargando=true;
			mi.desembolsotipos = [];
			mi.desembolsotipo;
			mi.mostraringreso=false;
			mi.esnuevo = false;
			mi.totalDesembolsoTipo = 0;
			mi.paginaActual = 1;
			mi.numeroMaximoPaginas = $utilidades.numeroMaximoPaginas;
			mi.elementosPorPagina = $utilidades.elementosPorPagina;
			
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
				    { name: 'descripcion', displayName: 'Descripción', cellClass: 'grid-align-left', enableFiltering: false}
				    
				],
				onRegisterApi: function(gridApi) {
					mi.gridApi = gridApi;
					gridApi.selection.on.rowSelectionChanged($scope,function(row) {
						mi.desembolsotipo = row.entity;
					});
					
					if($routeParams.reiniciar_vista=='rv'){
						mi.guardarEstado();
				    }
				    else{
				    	  $http.post('/SEstadoTabla', { action: 'getEstado', grid:'desembolsotipo', t: (new Date()).getTime()}).then(function(response){
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
				$http.post('/SDesembolsoTipo', { accion: 'getDesembolsotiposPagina', pagina: pagina, numerodesembolsotipos: $utilidades.elementosPorPagina }).success(
						function(response) {
							mi.desembolsotipos = response.desembolsotipos;
							mi.gridOptions.data = mi.desembolsotipos;
							mi.mostrarcargando = false;
						});
			}
			
			
			mi.irATabla = function() {
				mi.mostraringreso=false;
			}
			
			mi.guardarEstado=function(){
				var estado = mi.gridApi.saveState.save();
				var tabla_data = { action: 'guardaEstado', grid:'desembolsotipo', estado: JSON.stringify(estado), t: (new Date()).getTime() }; 
				$http.post('/SEstadoTabla', tabla_data).then(function(response){
					
				});
			}
			
			mi.cambioPagina=function(){
				mi.cargarTabla(mi.paginaActual);
			}
			
			mi.reiniciarVista=function(){
				if($location.path()=='/desembolsotipo/rv')
					$route.reload();
				else
					$location.path('/desembolsotipo/rv');
			}
			
			mi.nuevo = function() {
				mi.mostraringreso=true;
				mi.esnuevo = true;
				mi.desembolsotipo = null;
				mi.gridApi.selection.clearSelectedRows();
			};
			
			mi.guardar=function(){
				if(mi.desembolsotipo!=null && mi.desembolsotipo.nombre!=''){
					$http.post('/SDesembolsoTipo', {
						accion: 'guardarDesembolsoTipo',
						esnuevo: mi.esnuevo,
						id: mi.desembolsotipo.id,
						nombre: mi.desembolsotipo.nombre,
						descripcion: mi.desembolsotipo.descripcion
					}).success(function(response){
						if(response.success){
							mi.desembolsotipo.id = response.id;
							$utilidades.mensaje('success','Tipo Demsembolso '+(mi.esnuevo ? 'creado' : 'guardado')+' con éxito');
							mi.esnuevo = false;
							mi.cargarTabla();
						}
						else
							$utilidades.mensaje('danger','Error al '+(mi.esnuevo ? 'creado' : 'guardado')+' el Tipo desembolso');
					});
				}
				else
					$utilidades.mensaje('warning','Debe de llenar todos los campos obligatorios');
			};
			
			mi.editar = function() {
				if(mi.desembolsotipo!=null){
					mi.mostraringreso = true;
					mi.esnuevo = false;
				}
				else
					$utilidades.mensaje('warning','Debe seleccionar el Tipo Desembolso que desea editar');
			}
			
			mi.borrar = function(ev) {
				if(mi.desembolsotipo!=null){
					var confirm = $mdDialog.confirm()
				          .title('Confirmación de borrado')
				          .textContent('¿Desea borrar el Tipo Desembolso "'+mi.desembolsotipo.nombre+'"?')
				          .ariaLabel('Confirmación de borrado')
				          .targetEvent(ev)
				          .ok('Borrar')
				          .cancel('Cancelar');
	
				    $mdDialog.show(confirm).then(function() {
				    	$http.post('/SDesembolsoTipo', {
							accion: 'borrarDesembolsoTipo',
							id: mi.desembolsotipo.id
						}).success(function(response){
							if(response.success){
								$utilidades.mensaje('success','Tipo Desembolos fue borrado con éxito');
								mi.cargarTabla();
							}
							else
								$utilidades.mensaje('danger','Error al borrar el Tipo Desembolso');
						});
				    }, function() {
				    
				    });
				}
				else
					$utilidades.mensaje('warning','Debe seleccionar el Tipo Desembolso que desea borrar');
			};

			
			$http.post('/SDesembolsoTipo', { accion: 'numeroDesembolsoTipo' }).success(
				function(response) {
					mi.totalDesembolsoTipo = response.totaldesembolsotipo;
					mi.cargarTabla(1);
			});
			
}]);