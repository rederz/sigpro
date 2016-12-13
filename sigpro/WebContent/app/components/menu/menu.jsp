<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
    
    <nav ng-class="{'showbar' : !hidebar, 'hidebar': hidebar}" class="navbar navbar-inverse navbar-fixed-top">
		<script type="text/javascript">
		</script>
	    <div class="container">
	    
	        <input type="checkbox" id="navbar-toggle-cbox" />	       
	        <div class="navbar-header">
				<script type="text/javascript">
				</script>
	            <label for="navbar-toggle-cbox" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
	                <span class="icon-bar"></span>
	                <span class="icon-bar"></span>
	                <span class="icon-bar"></span>
	            </label>
	            <a class="navbar-brand" href="/main.jsp"><span class="glyphicon glyphicon-home" aria-hidden="true"></span> Inicio</a>
		    </div>
		    
		    <div class="collapse navbar-collapse" id="navBar">
	            <ul class="nav navbar-nav">
	                <li uib-dropdown>
	                    <a href="#" uib-dropdown-toggle><span class="glyphicon glyphicon-star" aria-hidden="true"></span> Ejemplos <b class="caret"></b></a>
	                     <ul uib-dropdown-menu role="menu" aria-labelledby="split-button">
	                     	<li role="menuitem"><a href="#!/formaejemplo">Forma Ejemplo</a></li>
	                     	<li role="menuitem"><a href="#!/cooperante">Cooperante</a></li>
	                     	<li role="menuitem"><a href="#!/proyecto">Proyecto</a></li>
	                     	<li role="menuitem"><a href="#!/proyectotipo">Tipo Proyecto</a></li>
	                     </ul>
	                </li>
                    <li uib-dropdown>
                         <a href="#" uib-dropdown-toggle><span class="glyphicon glyphicon-star" aria-hidden="true"></span> Admin <b class="caret"></b></a>
                         <ul uib-dropdown-menu role="menu" aria-labelledby="split-button">
                            <li role="menuitem"><a href="#!/entidad">Entidad</a></li>
                            <li role="menuitem"><a href="#!/unidadEjecutora">Unidad Ejecutora</a></li>
                         </ul>
                    </li>
	            </ul>
	            <ul class="nav navbar-nav navbar-right">
		            <li><a href="/SLogout"><span class="glyphicon glyphicon-log-out" aria-hidden="true"></span> Salir</a></li>
		            <li><a><span class="glyphicon glyphicon-chevron-up" aria-hidden="true" ng-click="hideBarFromMenu()"></span> </a></li>
		        </ul>
	        </div>
	    </div>
	</nav>