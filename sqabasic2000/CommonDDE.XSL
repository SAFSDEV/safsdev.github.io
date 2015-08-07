<xsl:stylesheet version='1.0'
		xmlns:xsl='http://www.w3.org/1999/XSL/Transform'
		xmlns='http://www.w3.org/TR/REC-html40'>
    
    <xsl:output method="html" version="3.2" omit-xml-declaration="yes"/>
		

    <xsl:template match='/'>
    	<HTML>
    	<HEAD><TITLE>Data Driven Engine (DDE) Action Commands
    	</TITLE></HEAD>
    	<BODY BGCOLOR="#FFFFFF">
    	
    	<!-- Header Area -->
    	<xsl:call-template name="ShellTop"/>
    	
    		<!-- any content you can think of? -->
    	
    	<!-- Footer Area -->
    	<xsl:call-template name="ShellBottom"/>
    	
    	</BODY></HTML>
    </xsl:template>



    <xsl:template name="ShellTop">
	<xsl:call-template name="navBar"/>
	<HR/>    
    </xsl:template>


    
    <xsl:template name="ShellBottom">
    	<TABLE><TR>
    	<TD><FONT FACE="Arial" SIZE="2" COLOR="red">
    	    <xsl:for-each select="//error">
    	        <xsl:value-of select="."/><BR/>
    	    </xsl:for-each>
    	<BR/></FONT></TD></TR></TABLE>
	<HR/>    
	<xsl:call-template name="navBar"/>
    </xsl:template>



    <xsl:template name="navBar">
	<A HREF="DDEngineSetup.htm" target="_blank">DDE Setup</A>, 
	<A HREF="DDEngineReference.htm" target="_blank">DDEngineReference</A>, 
	<A HREF="SQABasicLibraries.htm" target="_blank">SQABasic Libraries</A>, 
	<A HREF="UsingDDVariables.htm" target="_blank">Using DDVariables</A>, 
	<A HREF="UsingFlowControl.htm" target="_blank">Error Recovery and Flow Control</A>, 
	<A HREF="UsingCustomExtensions.htm" target="_blank">Custom Extensions</A>
    </xsl:template>

</xsl:stylesheet>
