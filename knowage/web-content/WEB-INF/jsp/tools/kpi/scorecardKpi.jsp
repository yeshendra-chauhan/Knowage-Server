<%--
Knowage, Open Source Business Intelligence suite
Copyright (C) 2016 Engineering Ingegneria Informatica S.p.A.

Knowage is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

Knowage is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
--%>


<%@ page language="java" pageEncoding="utf-8" session="true"%>


<%-- ---------------------------------------------------------------------- --%>
<%-- JAVA IMPORTS															--%>
<%-- ---------------------------------------------------------------------- --%>


<%@include file="/WEB-INF/jsp/commons/angular/angularResource.jspf"%>


<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html ng-app="scorecardManager">

<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">

<%@include file="/WEB-INF/jsp/commons/angular/angularImport.jsp"%>
<link rel="stylesheet" type="text/css"	href="${pageContext.request.contextPath}/themes/commons/css/customStyle.css"> 
<script type="text/javascript" src="${pageContext.request.contextPath}/js/src/angular_1.4/tools/kpi/scorecardKpiController.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/src/angular_1.4/tools/kpi/scorecardSubController/scorecardDefinitionController.js"></script>

</head>
<body>

	<angular-list-detail ng-controller="scorecardMasterController"  full-screen="true">
		
		<list label="translate.load('sbi.kpi.measure.list')" ng-controller="scorecardListController" new-function="newScorecardFunction" layout-column>
<!-- 		 	<angular-table id='measureListTable' ng-model=measureRuleList -->
<!-- 				columns='measureRuleColumnsList' -->
<!-- 			 	 show-search-bar=true -->
<!-- 			 	 speed-menu-option=measureMenuOption -->
<!-- 				 click-function="measureClickFunction(item);" > </angular-table> -->
		</list>
				
		<detail ng-controller="scorecardDetailController" save-function="saveScorecardFunction" disable-save-button=""  >
		
			<div layout="row" flex ng-controller="scorecardDefinitionController">
					<%@include	file="./scorecardTemplate/scorecardDefinitionTemplate.jsp"%>
			</div>
		
		</detail>
		
	</angular-list-detail>
</body>
</html>
