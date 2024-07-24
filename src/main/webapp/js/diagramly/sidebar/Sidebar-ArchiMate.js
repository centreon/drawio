(function()
{
	// Adds ArchiMate 2.1 shapes
	Sidebar.prototype.addArchiMatePalette = function()
	{
		var w = 100;
		var h = 75;
		var s = 'html=1;outlineConnect=0;shape=mxgraph.archimate.';
		var am1 = 'html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#ffff99;shape=mxgraph.archimate.';
		var am2 = 'html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#99ffff;shape=mxgraph.archimate.';
		var am3 = 'html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#99ff99;shape=mxgraph.archimate.';
		var am4 = 'html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#ffccff;shape=mxgraph.archimate.';
		var am5 = 'html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#ccccff;shape=mxgraph.archimate.';
		var am6 = 'html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#ffe0e0;shape=mxgraph.archimate.';
		var am7 = 'html=1;outlineConnect=0;whiteSpace=wrap;fillColor=#ffe0e0;shape=mxgraph.archimate.';
		var gn = 'mxgraph.archimate';
		var dt = 'archimate ';
		this.setCurrentSearchEntryLibrary('archimate');
		
		this.addPaletteFunctions('archimate', mxResources.get('archiMate21'), false,
		[
			this.createVertexTemplateEntry(am1 + 'application;appType=actor', 
					w, h, '', 'Business Actor', null, null, this.getTagsForStencil(gn, 'application', dt + 'business actor').join(' ')),
			this.createVertexTemplateEntry(am1 + 'application;appType=role', 
					w, h, '', 'Business Role', null, null, this.getTagsForStencil(gn, '', dt + 'business role').join(' ')),
			this.createVertexTemplateEntry(am1 + 'application;appType=collab', 
					w, h, '', 'Business Collaboration', null, null, this.getTagsForStencil(gn, '', dt + 'business collaboration').join(' ')),
			this.createVertexTemplateEntry(am1 + 'application;appType=interface', 
					w, h, '', 'Business Interface', null, null, this.getTagsForStencil(gn, '', dt + 'business interface').join(' ')),
			this.createVertexTemplateEntry(am1 + 'application;appType=interface2', 
					w, h, '', 'Business Interface', null, null, this.getTagsForStencil(gn, '', dt + 'business interface').join(' ')),
			this.createVertexTemplateEntry(am1 + 'location', 
					w, h, '', 'Location', null, null, this.getTagsForStencil(gn, '', dt + 'location').join(' ')),
			this.createVertexTemplateEntry(am1 + 'business;busType=process', 
					w, h, '', 'Business Process', null, null, this.getTagsForStencil(gn, '', dt + 'business process').join(' ')),
			this.createVertexTemplateEntry(am1 + 'business;busType=function', 
					w, h, '', 'Business Function', null, null, this.getTagsForStencil(gn, '', dt + 'business function').join(' ')),
			this.createVertexTemplateEntry(am1 + 'business;busType=interaction', 
					w, h, '', 'Business Interaction', null, null, this.getTagsForStencil(gn, '', dt + 'business interaction').join(' ')),
			this.createVertexTemplateEntry(am1 + 'business;busType=event', 
					w, h, '', 'Business Event', null, null, this.getTagsForStencil(gn, '', dt + 'business event').join(' ')),
			this.createVertexTemplateEntry(am1 + 'business;busType=service', 
					w, h, '', 'Business Service', null, null, this.getTagsForStencil(gn, '', dt + 'business service').join(' ')),
			this.createVertexTemplateEntry(am1 + 'businessObject;overflow=fill', w, h, 
					'<table cellpadding="0" cellspacing="0" style="font-size:1em;width:100%;height:100%;"><tr style="height:20px;"><td align="center"></td></tr><tr><td align="left" valign="top" style="padding:4px;"></td></tr></table>', 
					'Business Object', null, null, this.getTagsForStencil(gn, '', dt + 'business object').join(' ')),
			this.createVertexTemplateEntry(am1 + 'representation', 
					w, h, '', 'Representation', null, null, this.getTagsForStencil(gn, '', dt + 'representation').join(' ')),
			this.createVertexTemplateEntry('fillColor=#ffff99;whiteSpace=wrap;shape=cloud;html=1;', 
					w, h, '', 'Meaning', null, null, this.getTagsForStencil(gn, '', dt + 'meaning').join(' ')),
			this.createVertexTemplateEntry('fillColor=#ffff99;whiteSpace=wrap;shape=ellipse;html=1;', 
					w, h * 0.75, '', 'Value', null, null, this.getTagsForStencil(gn, '', dt + 'value').join(' ')),
			this.createVertexTemplateEntry(am1 + 'product;overflow=fill', w, h, 
					'<table cellpadding="0" cellspacing="0" style="font-size:1em;width:100%;height:100%;"><tr style="height:20px;"><td align="left"></td></tr><tr><td align="left" valign="top" style="padding:4px;"></td></tr></table>', 
					'Product', null, null, this.getTagsForStencil(gn, '', dt + 'product').join(' ')),
			this.createVertexTemplateEntry(am1 + 'businessObject;overflow=fill', w, h, 
					'<table cellpadding="0" cellspacing="0" style="font-size:1em;width:100%;height:100%;"><tr style="height:20px;"><td align="center"></td></tr><tr><td align="left" valign="top" style="padding:4px;"></td></tr></table>', 
					'Contract', null, null, this.getTagsForStencil(gn, '', dt + 'contract').join(' ')),
			this.createVertexTemplateEntry(am2 + 'application;appType=comp', 
					w, h, '', 'Application Component', null, null, this.getTagsForStencil(gn, '', dt + 'application component').join(' ')),
			this.createVertexTemplateEntry(am2 + 'application;appType=collab', 
					w, h, '', 'Application Collaboration', null, null, this.getTagsForStencil(gn, '', dt + 'application collaboration').join(' ')),
			this.createVertexTemplateEntry(am2 + 'application;appType=interface', 
					w, h, '', 'Application Interface', null, null, this.getTagsForStencil(gn, '', dt + 'application interface').join(' ')),
			this.createVertexTemplateEntry(am2 + 'application;appType=interface2', 
					w, h, '', 'Application Interface', null, null, this.getTagsForStencil(gn, '', dt + 'application interface').join(' ')),
			this.createVertexTemplateEntry(am2 + 'application;appType=function', 
					w, h, '', 'Application Function', null, null, this.getTagsForStencil(gn, '', dt + 'application function').join(' ')),
			this.createVertexTemplateEntry(am2 + 'application;appType=interaction', 
					w, h, '', 'Application Interaction', null, null, this.getTagsForStencil(gn, '', dt + 'application interaction').join(' ')),
			this.createVertexTemplateEntry(am2 + 'application;appType=service', 
					w, h, '', 'Application Service', null, null, this.getTagsForStencil(gn, '', dt + 'application service').join(' ')),
			this.createVertexTemplateEntry(am2 + 'businessObject;overflow=fill', w, h, 
					'<table cellpadding="0" cellspacing="0" style="font-size:1em;width:100%;height:100%;"><tr style="height:20px;"><td align="center"></td></tr><tr><td align="left" valign="top" style="padding:4px;"></td></tr></table>', 
					'Data Object', null, null, this.getTagsForStencil(gn, '', dt + 'data object').join(' ')),
			this.createVertexTemplateEntry(am3 + 'application;appType=node',
					w, h, '', 'Node', null, null, this.getTagsForStencil(gn, '', dt + 'node').join(' ')),
			this.createVertexTemplateEntry(am3 + 'tech;techType=device', 
					w, h, '', 'Device', null, null, this.getTagsForStencil(gn, '', dt + 'device').join(' ')),
			this.createVertexTemplateEntry(am3 + 'application;appType=network',
					w, h, '', 'Network', null, null, this.getTagsForStencil(gn, '', dt + 'network').join(' ')),
			this.createVertexTemplateEntry(am3 + 'application;appType=commPath', 
					w, h, '', 'Communications Path', null, null, this.getTagsForStencil(gn, '', dt + 'communications path').join(' ')),
			this.createVertexTemplateEntry(am3 + 'application;appType=interface', 
					w, h, '', 'Infrastructure Interface', null, null, this.getTagsForStencil(gn, '', dt + 'infrastructure interface').join(' ')),
			this.createVertexTemplateEntry(am3 + 'application;appType=interface2', 
					w, h, '', 'Infrastructure Interface', null, null, this.getTagsForStencil(gn, '', dt + 'infrastructure interface').join(' ')),
			this.createVertexTemplateEntry(am3 + 'application;appType=sysSw', 
					w, h, '', 'System Software', null, null, this.getTagsForStencil(gn, '', dt + 'system software').join(' ')),
			this.createVertexTemplateEntry(am3 + 'business;busType=function', 
					w, h, '', 'Infrastructure Function', null, null, this.getTagsForStencil(gn, '', dt + 'infraastructure function').join(' ')),
			this.createVertexTemplateEntry(am3 + 'business;busType=service', 
					w, h, '', 'Infrastructure Service', null, null, this.getTagsForStencil(gn, '', dt + 'infrastructure service').join(' ')),
			this.createVertexTemplateEntry(am3 + 'application;appType=artifact', 
					w, h, '', 'Artifact', null, null, this.getTagsForStencil(gn, '', dt + 'artifact').join(' ')),
			
			this.createEdgeTemplateEntry('edgeStyle=elbowEdgeStyle;html=1;endArrow=none;elbow=vertical', 
					w, h, '', 'Association', null, this.getTagsForStencil(gn, '', dt + 'association').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=elbowEdgeStyle;html=1;endArrow=open;elbow=vertical;endFill=1;dashed=1', 
					w, h, '', 'Access', null, this.getTagsForStencil(gn, '', dt + 'access').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=elbowEdgeStyle;html=1;endArrow=none;elbow=vertical;endFill=0;dashed=1', 
					w, h, '', 'Access', null, this.getTagsForStencil(gn, '', dt + 'access').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=elbowEdgeStyle;html=1;endArrow=open;elbow=vertical;endFill=1',
					w, h, '', 'Used by', null, this.getTagsForStencil(gn, '', dt + 'used by').join(' ')),
			this.createEdgeTemplateEntry('edgeStyle=elbowEdgeStyle;html=1;endArrow=block;elbow=vertical;endFill=0;dashed=1', 
					w, h, '', 'Realization', null, this.getTagsForStencil(gn, '', dt + 'realization').join(' ')),
			this.createEdgeTemplateEntry('endArrow=oval;html=1;endFill=1;startArrow=oval;startFill=1;edgeStyle=elbowEdgeStyle;elbow=vertical', 
					w, h, '', 'Assignment', null, this.getTagsForStencil(gn, '', dt + 'assignment').join(' ')),
			this.createEdgeTemplateEntry('endArrow=none;html=1;endFill=0;startArrow=diamondThin;startFill=0;edgeStyle=elbowEdgeStyle;elbow=vertical', 
					w, h, '', 'Aggregation', null, this.getTagsForStencil(gn, '', dt + 'aggregation').join(' ')),
			this.createEdgeTemplateEntry('endArrow=none;html=1;endFill=0;startArrow=diamondThin;startFill=1;edgeStyle=elbowEdgeStyle;elbow=vertical',
					w, h, '', 'Composition', null, this.getTagsForStencil(gn, '', dt + 'composition').join(' ')),
			this.createEdgeTemplateEntry('endArrow=block;html=1;endFill=1;startArrow=none;startFill=0;edgeStyle=elbowEdgeStyle;elbow=vertical;dashed=1',
					w, h, '', 'A', null, this.getTagsForStencil(gn, '', dt).join(' ')),
			this.createEdgeTemplateEntry('endArrow=block;html=1;endFill=1;startArrow=none;startFill=0;edgeStyle=elbowEdgeStyle;elbow=vertical;dashed=1', 
					w, h, '', 'Flow', null, this.getTagsForStencil(gn, '', dt + 'flow').join(' ')),
			this.createEdgeTemplateEntry('endArrow=block;html=1;endFill=1;startArrow=none;startFill=0;edgeStyle=elbowEdgeStyle;elbow=vertical;dashed=0', 
					w, h, '', 'Triggering', null, this.getTagsForStencil(gn, '', dt + 'triggering').join(' ')),
			this.createVertexTemplateEntry('swimlane;html=1;fillColor=#ffffff;whiteSpace=wrap', 
					w, h, '', 'Grouping', null, this.getTagsForStencil(gn, '', dt + 'grouping').join(' ')),
			this.createVertexTemplateEntry('ellipse;html=1;verticalLabelPosition=bottom;labelBackgroundColor=#ffffff;verticalAlign=top;fillColor=strokeColor', 
					10, 10, '', 'Junction', null, this.getTagsForStencil(gn, '', dt + 'junction').join(' ')),
			this.createEdgeTemplateEntry('endArrow=block;html=1;endFill=0;edgeStyle=elbowEdgeStyle;elbow=vertical',
					w, h, '', 'Specialization', null, this.getTagsForStencil(gn, '', dt + 'specialization').join(' ')),

			this.createVertexTemplateEntry(am4 + 'motiv;motivType=stake', 
					w, h, '', 'Stakeholder', null, null, this.getTagsForStencil(gn, '', dt + 'stakeholder').join(' ')),
			this.createVertexTemplateEntry(am4 + 'motiv;motivType=driver', 
					w, h, '', 'Driver', null, null, this.getTagsForStencil(gn, '', dt + 'driver').join(' ')),
			this.createVertexTemplateEntry(am4 + 'motiv;motivType=assess', 
					w, h, '', 'Assessment', null, null, this.getTagsForStencil(gn, '', dt + 'assesment').join(' ')),
			this.createVertexTemplateEntry(am5 + 'motiv;motivType=goal', 
					w, h, '', 'Goal', null, null, this.getTagsForStencil(gn, '', dt + 'goal').join(' ')),
			this.createVertexTemplateEntry(am5 + 'motiv;motivType=req', 
					w, h, '', 'Requirement', null, null, this.getTagsForStencil(gn, '', dt + 'goal').join(' ')),
			this.createVertexTemplateEntry(am5 + 'motiv;motivType=const', 
					w, h, '', 'Constraint', null, null, this.getTagsForStencil(gn, '', dt + 'constraint').join(' ')),
			this.createVertexTemplateEntry(am5 + 'motiv;motivType=princ', 
					w, h, '', 'Principle', null, null, this.getTagsForStencil(gn, '', dt + 'principle').join(' ')),
			
			this.createVertexTemplateEntry(am6 + 'rounded=1', 
					w, h, '', 'Work Package', null, null, this.getTagsForStencil(gn, '', dt + 'work package').join(' ')),
			this.createVertexTemplateEntry(am6 + 'representation', 
					w, h, '', 'Deliverable', null, null, this.getTagsForStencil(gn, '', dt + 'deliverable').join(' ')),
			this.createVertexTemplateEntry(am3 + 'tech;techType=plateau', 
					w, h, '', 'Plateau', null, null, this.getTagsForStencil(gn, '', dt + 'plateau').join(' ')),
			this.createVertexTemplateEntry(am3 + 'gap', 
					w, h, '', 'Gap', null, null, this.getTagsForStencil(gn, '', dt + 'gap').join(' '))
		]);
		
		this.setCurrentSearchEntryLibrary();
	};
})();
 
