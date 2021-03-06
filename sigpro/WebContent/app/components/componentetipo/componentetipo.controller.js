var app = angular.module('componentetipoController', [ 'ngTouch']);

app.controller('componentetipoController',['$scope','$http','$interval','i18nService','Utilidades','$routeParams','$window','$location','$route','uiGridConstants','$mdDialog','$q','$uibModal',
	function($scope, $http, $interval,i18nService,$utilidades,$routeParams,$window,$location,$route,uiGridConstants,$mdDialog,$q,$uibModal) {
		var mi=this;
		
		$window.document.title = 'SIGPRO - Tipo Componente';
		i18nService.setCurrentLang('es');
		mi.mostrarcargando=true;
		mi.componentetipos = [];
		mi.componentetipo;
		mi.mostraringreso=false;
		mi.esnuevo = false;
		mi.totalComponentetipos = 0;
		mi.paginaActual = 1;
		mi.numeroMaximoPaginas = $utilidades.numeroMaximoPaginas;
		mi.elementosPorPagina = $utilidades.elementosPorPagina;
		
		
		//--
		mi.componentepropiedades =[];
		mi.componentepropiedad =null;
		mi.mostrarcargandoCompProp=true;
		mi.mostrarPropiedadComponente = false;
		mi.paginaActualPropiedades=1;
		
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
				    { name: 'usuarioCreo', displayName: 'Usuario Creación'},
				    { name: 'fechaCreacion', displayName: 'Fecha Creación', cellClass: 'grid-align-right', type: 'date', cellFilter: 'date:\'dd/MM/yyyy\''}
				],
				onRegisterApi: function(gridApi) {
					mi.gridApi = gridApi;
					gridApi.selection.on.rowSelectionChanged($scope,function(row) {
						mi.componentetipo = row.entity;
					});
					
					if($routeParams.reiniciar_vista=='rv'){
						mi.guardarEstado();
				    }
				    else{
				    	  $http.post('/SEstadoTabla', { action: 'getEstado', grid:'componenteTipos', t: (new Date()).getTime()}).then(function(response){
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
			$http.post('/SComponenteTipo', { accion: 'getComponentetiposPagina', pagina: pagina, numerocomponentetipos: $utilidades.elementosPorPagina }).success(
					function(response) {
						mi.componentetipos = response.componentetipos;
						mi.gridOptions.data = mi.componentetipos;
						mi.mostrarcargando = false;
						mi.componentetipo = null;
					});
		}
		
		mi.guardar=function(){
			if(mi.componentetipo!=null  && mi.componentetipo.nombre!=''){
				var idspropiedad="";
				for (i = 0 ; i<mi.componentepropiedades.length ; i ++){
					if (i==0){
						idspropiedad = idspropiedad.concat("",mi.componentepropiedades[i].id); 
					}else{
						idspropiedad = idspropiedad.concat(",",mi.componentepropiedades[i].id);
					}
				}
				
				$http.post('/SComponenteTipo', {
					accion: 'guardarComponentetipo',
					esnuevo: mi.esnuevo,
					id: mi.componentetipo.id,
					nombre: mi.componentetipo.nombre,
					descripcion: mi.componentetipo.descripcion,
					propiedades: idspropiedad.length > 0 ? idspropiedad : null
				}).success(function(response){
					if(response.success){
						$utilidades.mensaje('success','Tipo Componente '+(mi.esnuevo ? 'creado' : 'guardado')+' con éxito');
						mi.esnuevo = false;
						mi.componentetipo.id = response.id;
						mi.cargarTabla();
						
					}
					else
						$utilidades.mensaje('danger','Error al '+(mi.esnuevo ? 'crear' : 'guardar')+' el Tipo Componente');
				});
			}
			else
				$utilidades.mensaje('warning','Debe de llenar todos los campos obligatorios');
		};
		
		mi.editar = function() {
			if(mi.componentetipo!=null){
				mi.mostraringreso = true;
				mi.esnuevo = false;
				mi.cargarTotalPropiedades();
			}
			else
				$utilidades.mensaje('warning','Debe seleccionar el Tipo de Componente que desea editar');
		}
		
		
		mi.borrar = function(ev) {
			if(mi.componentetipo!=null){
				var confirm = $mdDialog.confirm()
			          .title('Confirmación de borrado')
			          .textContent('¿Desea borrar el tipo de componente "'+mi.componentetipo.nombre+'"?')
			          .ariaLabel('Confirmación de borrado')
			          .targetEvent(ev)
			          .ok('Borrar')
			          .cancel('Cancelar');

			    $mdDialog.show(confirm).then(function() {
			    	$http.post('/SComponenteTipo', {
						accion: 'borrarComponenteTipo',
						id: mi.componentetipo.id
					}).success(function(response){
						if(response.success){
							$utilidades.mensaje('success','Tipo Componente borrado con éxito');
							mi.componentetipo = null;
							mi.cargarTabla();
						}
						else
							$utilidades.mensaje('danger','Error al borrar el Tipo Componente');
					});
			    }, function() {
			    
			    });
			}
			else
				$utilidades.mensaje('warning','Debe seleccionar el Tipo Componente que desea borrar');
		};
		
		mi.nuevo = function() {
			mi.mostraringreso=true;
			mi.esnuevo = true;
			mi.componentetipo = null;
			mi.gridApi.selection.clearSelectedRows();
			mi.cargarTotalPropiedades();
		};
	
		mi.irATabla = function() {
			mi.mostraringreso=false;
		}
		
		mi.guardarEstado=function(){
			var estado = mi.gridApi.saveState.save();
			var tabla_data = { action: 'guardaEstado', grid:'componentetipos', estado: JSON.stringify(estado), t: (new Date()).getTime() }; 
			$http.post('/SEstadoTabla', tabla_data).then(function(response){
				
			});
		}
		
		mi.cambioPagina=function(){
			mi.cargarTabla(mi.paginaActual);
		}
		
		mi.reiniciarVista=function(){
			if($location.path()=='/componentetipo/rv')
				$route.reload();
			else
				$location.path('/componentetipo/rv');
		}
		
		$http.post('/SComponenteTipo', { accion: 'numeroComponenteTipos' }).success(
				function(response) {
					mi.totalComponentetipos = response.totalcomponentetipos;
					mi.cargarTabla(1);
				}
		);
		//----
		
		mi.gridOptionscomponentePropiedad = {
				enableRowSelection : true,
				enableRowHeaderSelection : false,
				multiSelect: false,
				modifierKeysToMultiSelect: false,
				noUnselect: true,
				enableFiltering: true,
				enablePaginationControls: false,
			    paginationPageSize: 10,
				columnDefs : [ 
					{ name: 'id', width: 100, displayName: 'ID', cellClass: 'grid-align-right', type: 'number', enableFiltering: false },
				    { name: 'nombre', width: 200, displayName: 'Nombre',cellClass: 'grid-align-left' },
				    { name: 'descripcion', displayName: 'Descripción', cellClass: 'grid-align-left', enableFiltering: false},
				    { name: 'datotiponombre', displayName: 'Tipo Dato'}
				    
				],
				onRegisterApi: function(gridApi) {
					mi.gridApi = gridApi;
					gridApi.selection.on.rowSelectionChanged($scope,function(row) {
						mi.componentepropiedad = row.entity;
					});
				}
		};
		
		mi.cargarTablaPropiedades = function(pagina){
			mi.mostrarcargandoProyProp=true;
			$http.post('/SComponentePropiedad', 
					{ 
						accion: 'getComponentePropiedadPagina',
						pagina: pagina,
						idComponenteTipo:mi.componentetipo!=null ? mi.componentetipo.id : null, 
						numerocomponentepropiedad: $utilidades.elementosPorPagina }).success(
				function(response) {
					
					mi.componentepropiedades = response.componentepropiedades;
					mi.gridOptionscomponentePropiedad.data = mi.componentepropiedades;
					mi.mostrarcargandoCompProp = false;
					mi.mostrarPropiedad = true;
				});
			
		}
		
		mi.cargarTotalPropiedades = function(){
			$http.post('/SComponentePropiedad', { accion: 'numeroComponentePropiedades' }).success(
					function(response) {
						mi.totalComponentepropiedades = response.totalcomponentepropiedades;
						mi.cargarTablaPropiedades(mi.paginaActualPropiedades);
					}
			);
		}
		
		mi.eliminarPropiedad = function(){
			if (mi.componentepropiedad != null){
				for (i = 0 ; i<mi.componentepropiedades.length ; i ++){
					if (mi.componentepropiedades[i].id === mi.componentepropiedad.id){
						mi.componentepropiedades.splice (i,1);
						break;
					}
				}
				mi.componentepropiedad = null;
			}else{
				$utilidades.mensaje('warning','Debe seleccionar la Propiedad que desea eliminar');
			}
		}
		
		mi.eliminarPropiedad2 = function(row){
			var index = mi.componentepropiedades.indexOf(row);
	        if (index !== -1) {
	            mi.componentepropiedades.splice(index, 1);
	        }
		}
		
		mi.seleccionTabla = function(row){
			if (mi.componentepropiedad !=null && mi.componentepropiedad.id == row.id){
				mi.componentepropiedad = null;
			}else{
				mi.componentepropiedad = row;
			}
		}
		
		mi.buscarPropiedad = function(titulo, mensaje) {
			var modalInstance = $uibModal.open({
			    animation : 'true',
			    ariaLabelledBy : 'modal-title',
			    ariaDescribedBy : 'modal-body',
			    templateUrl : 'buscarcomponentepropiedad.jsp',
			    controller : 'modalBuscarComponentePropiedad',
			    controllerAs : 'modalBuscar',
			    backdrop : 'static',
			    size : 'md',
			    resolve : {
					idspropiedad : function() {
						var idspropiedad = "";
						var propiedadTemp;
						for (i = 0, len =mi.componentepropiedades.length;  i < len; i++) {
				    		if (i == 0){
				    			idspropiedad = idspropiedad.concat("",mi.componentepropiedades[i].id);
				    		}else{
				    			idspropiedad = idspropiedad.concat(",",mi.componentepropiedades[i].id);
				    		}
				    	}
					    return idspropiedad;
					}
			    }

			});
			
			modalInstance.result.then(function(selectedItem) {
				mi.componentepropiedades.push(selectedItem);
				
			}, function() {
			});
		}
} ]);

app.controller('modalBuscarComponentePropiedad', [
	'$uibModalInstance', '$scope', '$http', '$interval', 'i18nService',
	'Utilidades', '$timeout', '$log','idspropiedad', modalBuscarComponentePropiedad
]);

function modalBuscarComponentePropiedad($uibModalInstance, $scope, $http, $interval, i18nService, $utilidades, $timeout, $log,idspropiedad) {
	
	var mi = this;

	mi.totalElementos = 0;
	mi.paginaActual = 1;
	mi.numeroMaximoPaginas = 5;
	mi.elementosPorPagina = 9;
	
	mi.mostrarCargando = false;
	mi.data = [];
	
	mi.itemSeleccionado = null;
	mi.seleccionado = false;
	
    $http.post('/SComponentePropiedad', {
    	accion : 'numerocomponenteoPropiedadesDisponibles'
        }).success(function(response) {
    	mi.totalElementos = response.totalcomponentepropiedades;
    	mi.elementosPorPagina = mi.totalElementos;
    	mi.cargarData(1);
    });
    
    mi.opcionesGrid = {
		data : mi.data,
		columnDefs : [
			{displayName : 'Id', name : 'id', cellClass : 'grid-align-right', type : 'number', width : 100
			}, { displayName : 'Nombre', name : 'nombre', cellClass : 'grid-align-left'}
		],
		enableRowSelection : true,
		enableRowHeaderSelection : false,
		multiSelect : false,
		modifierKeysToMultiSelect : false,
		noUnselect : false,
		enableFiltering : true,
		enablePaginationControls : false,
		paginationPageSize : 5,
		onRegisterApi : function(gridApi) {
		    mi.gridApi = gridApi;
		    mi.gridApi.selection.on.rowSelectionChanged($scope,
			    mi.seleccionarComponentePropiedad);
		}
    }
    
    mi.seleccionarComponentePropiedad = function(row) {
    	mi.itemSeleccionado = row.entity;
    	mi.seleccionado = row.isSelected;
    };

    mi.cargarData = function(pagina) {
    	var datos = {
    	    accion : 'getComponentePropiedadesTotalDisponibles',
    	    pagina : pagina,
    	    idspropiedades: idspropiedad,
    	    registros : mi.elementosPorPagina
    	};

    	mi.mostrarCargando = true;
    	$http.post('/SComponentePropiedad', datos).then(function(response) {
    	    if (response.data.success) {
    	    	mi.data = response.data.componentepropiedades;
    	    	mi.opcionesGrid.data = mi.data;
    			mi.mostrarCargando = false;
    	    }
    	});
    	
     };
     
     mi.cambioPagina = function() {
    	mi.cargarData(mi.paginaActual);
      }

     mi.ok = function() {
    	if (mi.seleccionado) {
    	    $uibModalInstance.close(mi.itemSeleccionado);
    	} else {
    	    $utilidades.mensaje('warning', 'Debe seleccionar una Propiedad');
    	}
     };

     mi.cancel = function() {
    	$uibModalInstance.dismiss('cancel');
     };
}
