<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
	<%@ page import="org.apache.shiro.SecurityUtils" %>
	<%@taglib prefix="shiro" uri="http://shiro.apache.org/tags" %>
	<div ng-controller="desembolsoController as desembolsoc" class="maincontainer all_page" id="title">
	<script type="text/ng-template" id="buscarDesembolsoTipo.jsp">
    	<%@ include file="/app/components/desembolso/buscarDesembolsoTipo.jsp"%>
  	</script>
		<h3>Desembolso</h3><br/>
		<h4>{{ desembolsoc.proyectonombre }}</h4><br/>
		
		<div class="row" align="center" ng-if="!desembolsoc.mostraringreso">
			<div class="col-sm-12 operation_buttons" align="right">
				<div class="btn-group">
			       <shiro:hasPermission name="crearCooperante">
			       		<label class="btn btn-primary" ng-click="desembolsoc.nuevo()">Nuevo</label>
			       </shiro:hasPermission> 
			       <shiro:hasPermission name="editarCooperante"><label class="btn btn-primary" ng-click="desembolsoc.editar()">Editar</label></shiro:hasPermission>
			       <shiro:hasPermission name="eliminarCooperante">
			       		<label class="btn btn-primary" ng-click="desembolsoc.borrar()">Borrar</label>
			       </shiro:hasPermission>
			       			        
    			</div>				
    		</div>
    		<shiro:hasPermission name="verCooperante">
    		<div class="col-sm-12" align="center">
    			<div style="height: 35px;">
					<div style="text-align: right;"><div class="btn-group" role="group" aria-label="">
						<a class="btn btn-default" href ng-click="desembolsoc.reiniciarVista()" role="button" uib-tooltip="Reiniciar la vista de la tabla" tooltip-placement="left"><span class="glyphicon glyphicon-repeat" aria-hidden="true"></span></a>
					</div>
					</div>
				</div>
				<br/>
				<div id="maingrid" ui-grid="desembolsoc.gridOptions" ui-grid-save-state 
						ui-grid-move-columns ui-grid-resize-columns ui-grid-selection ui-grid-pinning ui-grid-pagination class="grid">
					<div class="grid_loading" ng-hide="!desembolsoc.mostrarcargando">
				  	<div class="msg">
				      <span><i class="fa fa-spinner fa-spin fa-4x"></i>
						  <br /><br />
						  <b>Cargando, por favor espere...</b>
					  </span>
					</div>
				  </div>
				</div>
				<ul uib-pagination total-items="desembolsoc.totalDesembolsos" 
						ng-model="desembolsoc.paginaActual" 
						max-size="desembolsoc.numeroMaximoPaginas" 
						items-per-page="desembolsoc.elementosPorPagina"
						first-text="Primero"
						last-text="Último"
						next-text="Siguiente"
						previous-text="Anterior"
						class="pagination-sm" boundary-links="true" force-ellipses="true"
						ng-change="desembolsoc.cambioPagina()"
				></ul>
			</div>
    		</shiro:hasPermission>
    		
		</div>
		<div class="row" ng-show="desembolsoc.mostraringreso">
			<h4 ng-hide="!desembolsoc.esnuevo">Nuevo Desembolso</h4>
			<h4 ng-hide="desembolsoc.esnuevo">Edición de Desembolso</h4>
			<div class="col-sm-12 operation_buttons" align="right">
				<div class="btn-group">
			        <label class="btn btn-success" ng-click="desembolsoc.guardar()">Guardar</label>
			        <label class="btn btn-primary" ng-click="desembolsoc.irATabla()">Ir a Tabla</label>
    			</div>
    		</div>
			
			<div class="col-sm-12">
				<form>
					<div class="form-group">
						<label for="id">ID</label>
   						<label class="form-control" id="id">{{ desembolsoc.desembolso.id }}</label>
					</div>
					
					<div class="form_group">
						<label for="id">* Fecha</label>
						<p class="input-group">
				          <input type="text" class="form-control" uib-datepicker-popup="dd/MM/yyyy" ng-model="desembolsoc.fecha" is-open="desembolsoc.popup.abierto" 
				          	datepicker-options="desembolsoc.opcionesFecha" ng-required="true" close-text="Close" alt-input-formats="altInputFormats" />
				          <span class="input-group-btn">
				            <button type="button" class="btn btn-default" ng-click="desembolsoc.mostrarCalendar()"><i class="glyphicon glyphicon-calendar"></i></button>
				          </span>
				        </p>
					</div>
					
					<div class="form-group">
						<label for="monto">* Monto</label>
   						<input type="number" class="form-control" id="monto" placeholder="Monto" ng-model="desembolsoc.desembolso.monto">
					</div>
					
					<div class="form-group">
						<label for="tipocambio">* Tipo Cambio</label>
   						<input type="number" class="form-control" id="tipocambio" placeholder="Tipo Cambio" ng-model="desembolsoc.desembolso.tipocambio">
					</div>
					
					<div class="form-group " >
			          <label for="campo3">* Tipo Desembolso</label>
			          <div class="input-group">
			            <input type="hidden" class="form-control" ng-model="desembolsoc.desembolsotipoid" /> 
			            <input type="text" class="form-control" id="tipodesembolso" name="tipodesembolso" placeholder="Tipo desembolso" ng-model="desembolsoc.desembolsonombre" ng-readonly="true"/>
			            <span class="input-group-addon" ng-click="desembolsoc.buscarTipoDesembolso()"><i class="glyphicon glyphicon-search"></i></span>
			          </div>
			        </div>
					
					<div class="form-group">
						<label for="usuarioCreo">Usuario que creo</label>
   						<label class="form-control" id="usuarioCreo">{{ desembolsoc.desembolso.usuarioCreo }}</label>
					</div>
					<div class="form-group">
						<label for="fechaCreacion">Fecha de creación</label>
   						<label class="form-control" id="fechaCreacion">{{ desembolsoc.desembolso.fechaCreacion }}</label>
					</div>
					<div class="form-group">
						<label for="usuarioActualizo">Usuario que actualizo</label>
   						<label class="form-control" id="usuarioCreo">{{ desembolsoc.desembolso.usuarioActualizo }}</label>
					</div>
					<div class="form-group">
						<label for="fechaActualizacion">Fecha de actualizacion</label>
   						<label class="form-control" id="usuarioCreo">{{ desembolsoc.desembolso.fechaActualizacion }}</label>
					</div>
				</form>
			</div>
			<div align="center">Los campos marcados con * son obligatorios</div>
			<div class="col-sm-12 operation_buttons" align="right">
				<div class="col-sm-12 operation_buttons" align="right">
					<div class="btn-group">
				        <label class="btn btn-success" ng-click="desembolsoc.guardar()">Guardar</label>
				        <label class="btn btn-primary" ng-click="desembolsoc.irATabla()">Ir a Tabla</label>
	    			</div>
	    		</div>
    		</div>
		</div>
	</div>
