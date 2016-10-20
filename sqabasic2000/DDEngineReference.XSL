<xsl:stylesheet version='1.0'
		xmlns:xsl='http://www.w3.org/1999/XSL/Transform'
		xmlns='http://www.w3.org/TR/REC-html40'>
    
    <xsl:output encoding="UTF-8" method="html" version="3.2" omit-xml-declaration="yes"/>
    <xsl:include href="CommonDDE.XSL"/>

    <xsl:template match='/'>
    	<HTML>
    	<HEAD><TITLE>Data Driven Engine (DDE) Driver Commands
    	</TITLE>
	<SCRIPT language="JavaScript" fptype="dynamicoutline">
	    <xsl:text disable-output-escaping="yes">&#xA;</xsl:text>
	    <xsl:comment>&#xA;function dynOutline() {}&#xA;//</xsl:comment>
	    <xsl:text disable-output-escaping="yes">&#xA;</xsl:text>
	</SCRIPT>
	<SCRIPT language="JavaScript1.2" fptype="dynamicoutline" src="outline.js"></SCRIPT>
	<SCRIPT language="JavaScript1.2" fptype="dynamicoutline" for="document" event="onreadystatechange()">
	    <xsl:text disable-output-escaping="yes">&#xA;</xsl:text>
	    <xsl:comment>&#xA;initOutline()&#xA;//</xsl:comment>
	    <xsl:text disable-output-escaping="yes">&#xA;</xsl:text>
	</SCRIPT>
    	</HEAD>
    	<BODY BGCOLOR="#FFFFFF" ONCLICK="dynOutline()">
    	
	<P align="center"><BIG><BIG><BIG>Data-Driven Engine Reference</BIG></BIG></BIG></P>
	<CENTER><SMALL>(updated 06.11.2002)</SMALL></CENTER>
	<P align="left">The following reference material is in a format similar to an
	outline.  When you click on an item it will expand (or collapse) to show or
	hide the information available within that section.  Here you will find
	links to sample files, available commands for the engine and GUI components, and
	the syntax for these commands.  In general, an empty circle will
	signify the item does not expand, while a solid disk or square indicates the
	item does expand (or collapse).</P>
	<P align="left">Links:</P>
	<UL type="circle">
	    <LI>
	        <P align="left"><A href="../FRAMESDataDrivenTestAutomationFrameworks.htm" target="_blank" >
	        Test Automation Frameworks</A> for information on various forms of test automation
	        and specifically on our data driven or keyword driven form of automation.</P></LI>
	    <LI><A href="CreateAppMap.htm" target="_blank">Creating an Application Map</A> 
	        for your application.</LI>
	    <LI><A href="NotepadMap.txt" target="_blank">Sample Application Map</A>
	        developed with <A href="ProcessContainer.htm" target="_blank">ProcessContainer</A>
	        tool.</LI>
	    <LI><A href="NotepadStepFile.txt" target="_blank">Sample Test Table for StepDriver</A></LI>
	    <LI><A href="DDNotepad.txt" target="_blank">Sample Script to Launch StepDriver.</A><BR />
	        (Normally we would also develop Cycle and Suite tables and invoke CycleDriver instead of
	        the low level StepDriver.  But here we are simply trying to illustrate the Application
	        Map and its use.  CycleDriver and SuiteDriver do not generally access the Application
	        Map.)</LI>
	</UL>

    	<xsl:call-template name="ShellTop"/>
    		
	<P align="left">Reference:</P>
	<UL dynamicoutline="dynamicoutline" initcollapsed="initcollapsed">
  	    <LI><U>A few of notes on the general format of this reference:</U>
	        <UL>
	            <LI><FONT color="#0000FF">When an item has multiple syntax examples,
		    usually only the last one can be expanded to see the field explanations.</FONT></LI>
	            <LI><FONT color="#0000FF">Although some examples shown might be wrapped
		    onto two or more lines here, the full syntax for these commands is
		    expected to be all on one line in the actual data/step file.</FONT></LI>
	            <LI><FONT color="#0000FF">The syntax examples often show a comma (,)
		    as a record field separator.&#032; Data/Step files can actually use
		    almost any field separator desired.&#032; The separator will be
		    specified to the drivers during the initialization of the DDE or when
		    the test table is passed to the driver.</FONT></LI>
	            <LI><FONT color="#0000FF">When a command keyword accepts parameters, 
	            OPTIONAL fields are shown enclosed in brackets []. However, in general, 
	            OPTIONAL fields must be provided (or left blank\empty) if subsequent fields 
	            are provided.</FONT></LI>
	            <LI type="disc"><U><FONT color="#0000FF">Field Types definitions:</FONT></U>
		        <UL>
		            <LI><FONT color="#800080">TQ String: Trimmed Quoted String:&#032;</FONT>
		                <UL>
		                    <LI type="circle"><FONT color="#008000">A field that will be
			            trimmed of all leading and trailing whitespace.<BR/>
			            OPTIONALLY: Use double-quotes to retain leading and trailing
			            whitespace.<BR/>
			            The quotes will be removed before use.<BR/>
			            99.999% of all fields are of this type.</FONT></LI>
		                </UL>
		            </LI>
		            <LI><FONT color="#800080">QS String: Quoted String:&#032;</FONT>
		                <UL>
		                    <LI type="circle"><FONT color="#008000">A field defined by a
			            leading double-quote and a trailing double-quote irregardless of
			            any separator currently in force.&#032; To include a
			            double-quote within this string two double-quote characters must
			            exist with no intervening characters and neither of these can be
			            the outermost leading or trailing double-quote.<BR/>
			            The outermost quotes will not be returned as part of the string.<BR/>
			            Due to the nature of field parsing, this type of field generally
			            must be the last useful field in the input record if the
			            separator character exists anywhere within the field.<BR/>
			            The use of this field type is EXTREMELY rare!</FONT></LI>
		                </UL>
		            </LI>
		        </UL>
		    </LI>
	        </UL>
	    </LI>
	</UL>
	<UL dynamicoutline="dynamicoutline" initcollapsed="initcollapsed" >
	    <LI><U><STRONG>CORE DRIVERS:</STRONG></U>
	        <UL>
	            <LI type="disc">Common Record Types and DriverCommands for CycleDriver, SuiteDriver, and StepDriver
	      	        <UL>
		            <LI><FONT color="#0000FF">Skip RecordType&#032;&#032; (RecordType = &quot;S&quot;)</FONT>
		                <UL>
		                    <LI><FONT color="#800080">S, &quot;Skipping Security Test due to Defect
			            #XYZ&quot;, T, RunSecurityTests, ...</FONT>
			                <UL>
			                    <LI type="circle"><FONT color="#008000">Field&#032; 2 : TQ String. &#032;
				            Skip this record (usually a test record) but
			                    log the fact and the comment of why the record is being
			                    skipped.&#032; This is better than simply commenting out a
			                    test record which might then be forgotten.<BR/>
			                    Normally, these two fields are added to the front of an
			                    existing record to temporarily skip the record.&#032; Later,
			                    these two fields are easily deleted leaving the original
			                    record intact and executable.</FONT></LI>
			                </UL>
		                    </LI>
		                </UL>
		            </LI>
		            <LI><FONT color="#0000FF">Block RecordType (RecordType = &quot;B&quot;)</FONT>
		                <UL>
		                    <LI><FONT color="#800080">B, SomeBlockName</FONT>
			                <UL>
			                    <LI type="circle"><FONT color="#008000">Field&#032; 2 : TQ String.&#032;
				            Declares or defines a named reference point
			                    in this file.&#032; This is used for naming or
			                    referencing the start of a block or section in the
			                    file and is the target point for the GOTO Driver Commands and
				            Flow Control/Error Recovery Driver Commands.</FONT></LI>
			                </UL>
		                    </LI>
		                </UL>
		            </LI>
		            <LI><FONT color="#0000FF">BreakPoint RecordType (RecordType = &quot;BP&quot;)</FONT>
		                <UL>
		                    <LI type="circle"><FONT color="#800080">BP</FONT><BR/>
				    <FONT color="#008000">
				    Sets a breakpoint in the test table for when running the table
				    in Debug Mode.  Breakpoints can be set, but not ENABLED.  To use
				    breakpoints Robot must be running in Debug Mode AND breakpoints
				    must be turned &quot;ON&quot; with the BREAKPOINTS Driver Command.</FONT></LI>
		                </UL>
		            </LI>
		            <LI><FONT color="#0000FF">Driver Commands&#032; (RecordType = &quot;C&quot;)</FONT>
		                <UL>
  	                            <LI type="circle"><A HREF="{/keyword_library/libraryInfo/@doc}" target="_blank">
    	                                <FONT color="#000000"><xsl:value-of select="/keyword_library/libraryInfo/@name" /> Documentation.</FONT></A>
    	                            </LI>   

    				    <xsl:call-template name="Keywords"/>    	

           			</UL>
           		    </LI>
			</UL>
		    </LI>
    		</UL>
  	    </LI>
  	    <BR/>
  	    <LI><U><STRONG>COMPONENT FUNCTIONS:</STRONG></U>

                <UL>
		    <LI type="square"><FONT color="#0000FF"><STRONG>Generally, Component Function
		        Data/Step file RecordTypes = &quot;T&quot; followed by:</STRONG></FONT>
			<UL>
			    <LI type="circle"><FONT color="#800080">T, WindowID, WindowID,
			        AWindowAction, Param1, ...</FONT></LI>
			    <LI type="circle"><FONT color="#800080">T, WindowID, WindowID,
			        AWindowAction</FONT></LI>
			    <LI type="circle"><FONT color="#800080">T, WindowID, ComponentID,
				AComponentAction, Param1, ...</FONT></LI>
			    <LI><FONT color="#800080">T, WindowID, ComponentID, AComponentAction</FONT>
				<UL>
				    <LI type="circle"><FONT color="#008000">Field&#032; 2 : TQ Reference
				        for the Window to have context.<BR />
					Field&#032; 3 : TQ Reference for the Component in Window to have
					context.<BR />
					Field&#032; 4 : TQ Reference.&#032; The Action to perform on the
					Window/Component.<BR />
					Field&#032;[5-N]: TQ String&#032; Zero or more parameters for the
					selected Action.<BR />
					(If the Window itself receives the action then Fields 2 and 3 will
					be the same.)<BR />
				    </FONT></LI>
				</UL>
			    </LI>
			</UL>
		    </LI>
		    
		    <xsl:variable name="component" select="document('ComponentFunctions.xml')" />		
		    <xsl:apply-templates select="$component/componentfunctions" mode="reference" />
		    
  	        </UL>
  	        
    	    </LI>
    	</UL>
    	
    	<!-- Footer Area -->
    	<xsl:call-template name="ShellBottom"/>
    	</BODY></HTML>
    	
    </xsl:template>



    <xsl:template match="componentfunctions" mode="reference">
    
        <xsl:for-each select="file" >
	    <xsl:sort select="@href" />
	    <xsl:variable name="library" select="document(@href)" />
	    <xsl:apply-templates select="$library/keyword_library" mode="reference" />	    
        </xsl:for-each>
    
    </xsl:template>

    

    <xsl:template match="keyword_library" mode="reference">    
        <LI type="disc"><FONT color="#0000FF">
            <xsl:if test="./libraryInfo/@name = 'GenericMasterFunctions'" >
                <STRONG><BIG><xsl:value-of select="./libraryInfo/@name" /></BIG></STRONG>  
                (Available to nearly all components)
            </xsl:if>
            <xsl:if test="./libraryInfo/@name != 'GenericMasterFunctions'" >
                <xsl:value-of select="./libraryInfo/@name" />
            </xsl:if>
            </FONT>
    	    <UL>
  	        <LI type="circle"><A HREF="{/keyword_library/libraryInfo/@doc}" target="_blank">
  	            <FONT color="#000000">
    	            <xsl:value-of select="/keyword_library/libraryInfo/@name" /> Documentation.</FONT></A>
    	        </LI>   

	        <xsl:call-template name="Keywords" />

	    </UL>
        </LI>
    </xsl:template>

    

    <xsl:template name="LibInfo">    
	<xsl:value-of select="//libraryInfo/description/detailed_desc"/>
    </xsl:template>    



    <xsl:template name="Keywords">    
        <xsl:for-each select="//keyword">
	    <xsl:sort select="@displayText"/>
	    
            <LI><FONT color="#000000"><xsl:value-of select='@displayText'/>&#032;</FONT>
	        <UL>
    	            
	            <xsl:call-template name="Examples"/>

	        </UL>
            </LI>
        </xsl:for-each>       
    </xsl:template>



    <xsl:template name="Examples">    
        <xsl:for-each select='examples/example'>	    
	    <xsl:choose>	    
	        <xsl:when test="position() != last()">	        
            	    
            	    <LI type="circle"><FONT color="#800080"><xsl:value-of select="usage"/></FONT></LI>
            	    
            	</xsl:when>
            	<xsl:otherwise>            	    
		    
		    <xsl:if test="count(../../parameters/parameter) &gt; 0">
               	        <LI><FONT color="#800080"><xsl:copy-of select="usage"/></FONT>
            	            <UL type="circle">

  	                    <xsl:call-template name="Parameters"/>			
            	        
            	            </UL>
            	        </LI>	        
            	    </xsl:if>                	    

		    <xsl:if test="count(../../parameters/parameter) &lt; 1">
            	        <LI type="circle"><FONT color="#800080"><xsl:value-of select="usage"/></FONT></LI>
            	    </xsl:if>                	    
            	    
            	</xsl:otherwise>
	    </xsl:choose>	    
        </xsl:for-each>	        
    </xsl:template>



    <xsl:template name="Parameters">
        <xsl:for-each select='../../parameters/parameter'>	    
	        
	    <LI><FONT color="#008000">Field 
	    <xsl:if test="starts-with(@optional,'Y')">[</xsl:if>	    
	    <xsl:if test="not(starts-with(@optional,'Y'))">&#032;&#032;</xsl:if>
	    <xsl:if test="/keyword_library/libraryType/@type = 'DRIVER'" >
	        <xsl:number value="position() + 2"/>
	    </xsl:if>
	    <xsl:if test="/keyword_library/libraryType/@type = 'COMPONENT'" >
	        <xsl:number value="position() + 4"/>
	    </xsl:if>
	    <xsl:if test="starts-with(@optional,'Y')">]:</xsl:if>	    
	    <xsl:if test="not(starts-with(@optional,'Y'))">&#032;:</xsl:if>
	    <xsl:value-of select="@displayText"/><BR/>
            <xsl:value-of select="description/short_desc"/></FONT></LI>
        
        </xsl:for-each>	        
    </xsl:template>

</xsl:stylesheet>
