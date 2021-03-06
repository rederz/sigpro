var app = angular.module('proyectotipoController', [ 'ngTouch']);

app.controller('proyectotipoController',['$scope','$http','$interval','i18nService','Utilidades','$routeParams','$window','$location','$route','uiGridConstants','$mdDialog','$q','$uibModal',
	function($scope, $http, $interval,i18nService,$utilidades,$routeParams,$window,$location,$route,uiGridConstants,$mdDialog,$q,$uibModal) {
		var mi=this;
		
		$window.document.title = 'SIGPRO - Tipo Proyecto';
		i18nService.setCurrentLang('es');
		mi.mostrarcargando=true;
		mi.proyectotipos = [];
		mi.proyectotipo;
		mi.mostraringreso=false;
		mi.esnuevo = false;
		mi.totalProcetotipos = 0;
		mi.paginaActual = 1;
		mi.numeroMaximoPaginas = $utilidades.numeroMaximoPaginas;
		mi.elementosPorPagina = $utilidades.elementosPorPagina;
		
		
		//--
		mi.proyectopropiedades =[];
		mi.proyectopropiedad =null;
		mi.mostrarcargandoProyProp=true;
		mi.mostrarPropiedad = false;
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
						mi.proyectotipo = row.entity;
					});
					
					if($routeParams.reiniciar_vista=='rv'){
						mi.guardarEstado();
				    }
				    else{
				    	  $http.post('/SEstadoTabla', { action: 'getEstado', grid:'proyectoTipos', t: (new Date()).getTime()}).then(function(response){
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
			$http.post('/SProyectoTipo', { accion: 'getProyectoTipoPagina', pagina: pagina, numerocooperantes: $utilidades.elementosPorPagina }).success(
					function(response) {
						mi.proyectotipos = response.poryectotipos;
						mi.gridOptions.data = mi.proyectotipos;
						mi.mostrarcargando = false;
					});
		}
		
		mi.guardar=function(){
			if(mi.proyectotipo!=null  && mi.proyectotipo.nombre!=''){
				var idspropiedad="";
				for (i = 0 ; i<mi.proyectopropiedades.length ; i ++){
					if (i==0){
						idspropiedad = idspropiedad.concat("",mi.proyectopropiedades[i].id); 
					}else{
						idspropiedad = idspropiedad.concat(",",mi.proyectopropiedades[i].id);
					}
				}
				
				$http.post('/SProyectoTipo', {
					accion: 'guardarProyectotipo',
					esnuevo: mi.esnuevo,
					id: mi.proyectotipo.id,
					nombre: mi.proyectotipo.nombre,
					descripcion: mi.proyectotipo.descripcion,
					propiedades: idspropiedad
				}).success(function(response){
					if(response.success){
						$utilidades.mensaje('success','Tipo Proyecto '+(mi.esnuevo ? 'creado' : 'guardado')+' con éxito');
						mi.esnuevo = false;
						mi.proyectotipo.id = response.id;
						mi.cargarTabla();
						
					}
					else
						$utilidades.mensaje('danger','Error al '+(mi.esnuevo ? 'crear' : 'guardar')+' el Tipo Proyecto');
				});
			}
			else
				$utilidades.mensaje('warning','Debe de llenar todos los campos obligatorios');
		};
		
		mi.editar = function() {
			if(mi.proyectotipo!=null){
				mi.mostraringreso = true;
				mi.esnuevo = false;
				mi.cargarTotalPropiedades();
			}
			else
				$utilidades.mensaje('warning','Debe seleccionar el Tipo de Proyecto que desea editar');
		}
		
		
		mi.borrar = function(ev) {
			if(mi.proyectotipo!=null){
				var confirm = $mdDialog.confirm()
			          .title('Confirmación de borrado')
			          .textContent('¿Desea borrar el tipo de proyecto "'+mi.proyectotipo.nombre+'"?')
			          .ariaLabel('Confirmación de borrado')
			          .targetEvent(ev)
			          .ok('Borrar')
			          .cancel('Cancelar');

			    $mdDialog.show(confirm).then(function() {
			    	$http.post('/SProyectoTipo', {
						accion: 'borrarProyectoTipo',
						id: mi.proyectotipo.id
					}).success(function(response){
						if(response.success){
							$utilidades.mensaje('success','Tipo Proyecto borrado con éxito');
							mi.cargarTabla();
						}
						else
							$utilidades.mensaje('danger','Error al borrar el Tipo Proyecto');
					});
			    }, function() {
			    
			    });
			}
			else
				$utilidades.mensaje('warning','Debe seleccionar el Tipo Proyecto que desea borrar');
		};
		
		mi.nuevo = function() {
			mi.mostraringreso=true;
			mi.esnuevo = true;
			mi.proyectotipo = null;
			mi.gridApi.selection.clearSelectedRows();
			mi.cargarTotalPropiedades();
		};
	
		mi.irATabla = function() {
			mi.mostraringreso=false;
		}
		
		mi.guardarEstado=function(){
			var estado = mi.gridApi.saveState.save();
			var tabla_data = { action: 'guardaEstado', grid:'proyectotipos', estado: JSON.stringify(estado), t: (new Date()).getTime() }; 
			$http.post('/SEstadoTabla', tabla_data).then(function(response){
				
			});
		}
		
		mi.cambioPagina=function(){
			mi.cargarTabla(mi.paginaActual);
		}
		
		mi.reiniciarVista=function(){
			if($location.path()=='/proyectotipo/rv')
				$route.reload();
			else
				$location.path('/proyectotipo/rv');
		}
		
		$http.post('/SProyectoTipo', { accion: 'numeroProyectoTipos' }).success(
				function(response) {
					mi.totalProyectotipos = response.totalproyectotipos;
					mi.cargarTabla(1);
				}
		);
		//----
		mi.gridOptionsProyectoPropiedad = {
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
						mi.proyectopropiedad = row.entity;
					});
				}
		};
		
		mi.cargarTablaPropiedades = function(pagina){
			
			mi.mostrarcargandoProyProp=true;
			$http.post('/SProyectoPropiedad', 
					{ 
						accion: 'getProyectoPropiedadPagina',
						pagina: pagina,
						idProyectoTipo:mi.proyectotipo!=null ? mi.proyectotipo.id : null, 
						numeroproyectopropiedad: $utilidades.elementosPorPagina }).success(
				function(response) {
					
					mi.proyectopropiedades = response.proyectopropiedades;
					mi.gridOptionsProyectoPropiedad.data = mi.proyectopropiedades;
					mi.mostrarcargandoProyProp = false;
					mi.mostrarPropiedad = true;
				});
			
		}
		
		
		mi.cargarTotalPropiedades = function(){
			$http.post('/SProyectoPropiedad', { accion: 'numeroProyectoPropiedades' }).success(
					function(response) {
						mi.totalProyectopropiedades = response.totalproyectopropiedades;
						mi.cargarTablaPropiedades(mi.paginaActualPropiedades);
					}
			);
		}
		
		mi.eliminarPropiedad = function(){
			if (mi.proyectopropiedad != null){
				for (i = 0 ; i<mi.proyectopropiedades.length ; i ++){
					if (mi.proyectopropiedades[i].id === mi.proyectopropiedad.id){
						mi.proyectopropiedades.splice (i,1);
						break;
					}
				}
				mi.proyectopropiedad = null;
			}else{
				$utilidades.mensaje('warning','Debe seleccionar la Propiedad que desea eliminar');
			}
		}
		
		mi.eliminarPropiedad2 = function(row){
			var index = mi.proyectopropiedades.indexOf(row);
	        if (index !== -1) {
	            mi.proyectopropiedades.splice(index, 1);
	        }
		}
		
		mi.seleccionTabla = function(row){
			if (mi.proyectopropiedad !=null && mi.proyectopropiedad.id == row.id){
				mi.proyectopropiedad = null;
			}else{
				mi.proyectopropiedad = row;
			}
		}
		
		mi.buscarPropiedad = function(titulo, mensaje) {
			var modalInstance = $uibModal.open({
			    animation : 'true',
			    ariaLabelledBy : 'modal-title',
			    ariaDescribedBy : 'modal-body',
			    templateUrl : 'buscarpropiedad.jsp',
			    controller : 'modalBuscarPropiedad',
			    controllerAs : 'modalBuscar',
			    backdrop : 'static',
			    size : 'md',
			    resolve : {
					idspropiedad : function() {
						var idspropiedad = "";
						var propiedadTemp;
						for (i = 0, len =mi.proyectopropiedades.length;  i < len; i++) {
				    		if (i == 0){
				    			idspropiedad = idspropiedad.concat("",mi.proyectopropiedades[i].id);
				    		}else{
				    			idspropiedad = idspropiedad.concat(",",mi.proyectopropiedades[i].id);
				    		}
				    	}
					    return idspropiedad;
					}
			    }

			});
			
			modalInstance.result.then(function(selectedItem) {
				mi.proyectopropiedades.push(selectedItem);
				
			}, function() {
			});
		}
} ]);

app.controller('modalBuscarPropiedad', [
	'$uibModalInstance', '$scope', '$http', '$interval', 'i18nService',
	'Utilidades', '$timeout', '$log','idspropiedad', modalBuscarPropiedad
]);

function modalBuscarPropiedad($uibModalInstance, $scope, $http, $interval, i18nService, $utilidades, $timeout, $log,idspropiedad) {
	
	var mi = this;

	mi.totalElementos = 0;
	mi.paginaActual = 1;
	mi.numeroMaximoPaginas = 5;
	mi.elementosPorPagina = 9;
	
	mi.mostrarCargando = false;
	mi.data = [];
	
	mi.itemSeleccionado = null;
	mi.seleccionado = false;
	
    $http.post('/SProyectoPropiedad', {
    	accion : 'numeroProyectoPropiedadesDisponibles'
        }).success(function(response) {
    	mi.totalElementos = response.totalproyectopropiedades;
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
			    mi.seleccionarProyectoPropiedad);
		}
    }
    
    mi.seleccionarProyectoPropiedad = function(row) {
    	mi.itemSeleccionado = row.entity;
    	mi.seleccionado = row.isSelected;
    };

    mi.cargarData = function(pagina) {
    	var datos = {
    	    accion : 'getProyectoPropiedadesTotalDisponibles',
    	    pagina : pagina,
    	    idspropiedades: idspropiedad,
    	    registros : mi.elementosPorPagina
    	};

    	mi.mostrarCargando = true;
    	$http.post('/SProyectoPropiedad', datos).then(function(response) {
    	    if (response.data.success) {
    	    	
    	    	mi.data = response.data.proyectopropiedades;
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
