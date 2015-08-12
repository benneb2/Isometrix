declare  @moduleid                              int
        ,@LoggedInUserID                        int

select   @moduleid                              = (select ModuleID from tblModule where module = 'Incident Management')
        ,@LoggedInUserID                        = 1


------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------Definition----------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
select   d.ModuleDefinitionID
        ,l.ModuleDefinitionLabel
        ,d.[GUID]
        ,t.ModuleDefinitionType
        ,d.ModuleDefinitionSourceTypeID
        ,d.ModuleDefinitionSourceID
        ,s.[Source]
from    tblModuleDefinition d
inner join
        tblModuleDefinitionType t
on      d.ModuleDefinitionTypeID                = t.ModuleDefinitionTypeID
inner join
        tblModuleDefinitionLabel l
on      d.ModuleDefinitionID                    = l.ModuleDefinitionID
left join
        tblModuleDefinitionSource s
on      d.ModuleDefinitionSourceID              = s.SourceID
where   d.ModuleID                              = @moduleid
and     d.Functional                            = 1
and     l.ModuleDefinitionLabel                 in (
                                                 N'Where incident occurred'
                                                ,N'Views - Hidden'
                                                ,N'Risk discipline (Nature of the impact)'
                                                ,N'Date incident occurred'
                                                ,N'Incident description'
                                                ,N'Incident reported to'
                                                ,N'Incident status'
                                                ,N'Person reporting'
                                                ,N'Specific location'
                                                ,N'Incident category / sub category'
                                                ,N'Immediate Action Taken with Reason for Action Taken'
                                                ,N'External party involved?'
                                                ,N'External party'
                                                )
order by
        l.ModuleDefinitionLabel


------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------Source Values-------------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
declare  @sourceid                              int
        ,@GUID                                  nvarchar(max)
        ,@SourceSystemList                      nvarchar(max)
        ,@sql                                   nvarchar(max)

create table #Sources
(
         ModuleDefinitionSourceTypeID           int
        ,ModuleDefinitionSourceID               int
        ,SourceSystem                           nvarchar(max)
        ,[GUID]                                 nvarchar(max)
        ,SourceSystemList                       nvarchar(max)
)

create table #SourcesValues
(
         SourceID                               int
        ,SourceTypeID                           int
        ,SourceListID                           int
        ,SourceListParentID                     int
        ,SourceList                             nvarchar(max)
        ,SourceFactor                           nvarchar(max)
        ,SourceOrder                            int
        ,Hierarchy                              hierarchyid
        ,IndexValue                             int
        ,SourceURL                              varchar(max)
        ,[Level]                                int
        ,[View]                                 int
        ,RowNumber                              int
        ,RowNumber2                             int
        ,HierarchyString                        nvarchar(max)
        ,HierarchyLevel                         int
        ,HasChild                               int
)

insert into #Sources
(
         ModuleDefinitionSourceTypeID
        ,ModuleDefinitionSourceID    
        ,[GUID]                      
        ,SourceSystemList            
)
select   distinct d.ModuleDefinitionSourceTypeID
        ,d.ModuleDefinitionSourceID
        ,d.[GUID]
        ,sl.SourceSystemList
from    tblModuleDefinition d
inner join
        tblModuleDefinitionLabel l
on      d.ModuleDefinitionID                    = l.ModuleDefinitionID
left join
        tblModuleDefinitionSourceSystem ss
on      d.ModuleDefinitionSourceID              = ss.SourceID
left join
        tblModuleDefinitionSourceSystemList sl
on      ss.SourceSystemListID                   = sl.SourceSystemListID
where   d.ModuleID                              = @moduleid
and     d.Functional                            = 1
and     d.ModuleDefinitionSourceTypeID          is not null
and     l.ModuleDefinitionLabel                 in (
                                                 N'Where incident occurred'
                                                ,N'Views - Hidden'
                                                ,N'Risk discipline (Nature of the impact)'
                                                ,N'Date incident occurred'
                                                ,N'Incident description'
                                                ,N'Incident reported to'
                                                ,N'Incident status'
                                                ,N'Person reporting'
                                                ,N'Specific location'
                                                ,N'Incident category / sub category'
                                                ,N'Immediate Action Taken with Reason for Action Taken'
                                                ,N'External party involved?'
                                                ,N'External party'
                                                )
order by d.ModuleDefinitionSourceTypeID
        ,d.ModuleDefinitionSourceID

while (select top 1 ModuleDefinitionSourceID from #Sources where ModuleDefinitionSourceTypeID = 1 order by ModuleDefinitionSourceTypeID,ModuleDefinitionSourceID) is not null
begin
        select  @sourceid                       = (select top 1 ModuleDefinitionSourceID from #Sources where ModuleDefinitionSourceTypeID = 1 order by ModuleDefinitionSourceTypeID,ModuleDefinitionSourceID)

        select  @sql = N'exec spss_SourceList @SourceID = ' + cast(@sourceid as nvarchar(max)) + N',@UserID=' + cast(@LoggedInUserID as nvarchar(max))

        insert into #SourcesValues
        (
         SourceListID      
        ,SourceListParentID
        ,SourceList        
        ,SourceFactor      
        ,SourceOrder       
        ,Hierarchy         
        ,IndexValue        
        ,SourceURL         
        )
        exec sp_executesql      @sql

        update  #SourcesValues
        set      SourceID                       = @sourceid
                ,SourceTypeID                   = 1
        where   SourceID                        is null

        delete from #Sources
        where ModuleDefinitionSourceID          = @sourceid
end

while (select top 1 ModuleDefinitionSourceID from #Sources where ModuleDefinitionSourceTypeID = 2 order by ModuleDefinitionSourceTypeID,ModuleDefinitionSourceID) is not null
begin
        select   @sourceid                      = (select top 1 ModuleDefinitionSourceID from #Sources where ModuleDefinitionSourceTypeID = 2 order by ModuleDefinitionSourceTypeID,ModuleDefinitionSourceID)
                ,@GUID                          = (select top 1 [GUID] from #Sources  where ModuleDefinitionSourceTypeID = 2 order by ModuleDefinitionSourceTypeID,ModuleDefinitionSourceID)

        select  @sql = N'exec spss_SourceList @SourceID = ' + cast(@sourceid as nvarchar(max)) + N',@UserID=' + cast(@LoggedInUserID as nvarchar(max)) + N',@GUID=N''' + cast(@GUID as nvarchar(max)) + N''''

        insert into #SourcesValues
        (
         SourceListID      
        ,SourceListParentID
        ,SourceList        
        ,SourceFactor      
        ,SourceURL         
        ,[Level]
        ,[View]
        )
        exec sp_executesql      @sql

        update  #SourcesValues
        set      SourceID                       = @sourceid
                ,SourceTypeID                   = 2
        where   SourceID                        is null

        delete from #Sources
        where ModuleDefinitionSourceID          = @sourceid
end

while (select top 1 ModuleDefinitionSourceID from #Sources where ModuleDefinitionSourceTypeID = 3 order by ModuleDefinitionSourceTypeID,ModuleDefinitionSourceID) is not null
begin
        select   @sourceid                      = (select top 1 ModuleDefinitionSourceID from #Sources where ModuleDefinitionSourceTypeID = 3 order by ModuleDefinitionSourceTypeID,ModuleDefinitionSourceID)
                ,@SourceSystemList              = (select top 1 SourceSystemList from #Sources where ModuleDefinitionSourceTypeID = 3 order by ModuleDefinitionSourceTypeID,ModuleDefinitionSourceID)

        select  @sql = N'exec spss_SourceList @SourceID = ' + cast(@sourceid as nvarchar(max)) + N',@UserID=' + cast(@LoggedInUserID as nvarchar(max))

        if @SourceSystemList = N'Levels'
        begin
                insert into #SourcesValues
                (
                 SourceListID      
                ,SourceList        
                ,SourceFactor      
                ,SourceListParentID
                ,Hierarchy
                )
                exec sp_executesql      @sql
        end
        else
        begin
                insert into #SourcesValues
                (
                 SourceListID      
                ,SourceList        
                ,SourceFactor      
                ,SourceListParentID
                )
                exec sp_executesql      @sql
        end

        update  #SourcesValues
        set      SourceID                       = @sourceid
                ,SourceTypeID                   = 3
        where   SourceID                        is null

        delete from #Sources
        where ModuleDefinitionSourceID          = @sourceid
end

while (select top 1 ModuleDefinitionSourceID from #Sources where ModuleDefinitionSourceTypeID = 4 order by ModuleDefinitionSourceTypeID,ModuleDefinitionSourceID) is not null
begin
        select   @sourceid                      = (select top 1 ModuleDefinitionSourceID from #Sources where ModuleDefinitionSourceTypeID = 4 order by ModuleDefinitionSourceTypeID,ModuleDefinitionSourceID)
                ,@GUID                          = (select top 1 [GUID] from #Sources where ModuleDefinitionSourceTypeID = 4 order by ModuleDefinitionSourceTypeID,ModuleDefinitionSourceID)

        select  @sql = N'exec spss_SourceList @SourceID = ' + cast(@sourceid as nvarchar(max)) + N',@UserID=' + cast(@LoggedInUserID as nvarchar(max)) + N',@GUID=N''' + cast(@GUID as nvarchar(max)) + N''''

        insert into #SourcesValues
        (
         SourceListID      
        ,SourceListParentID
        ,SourceList        
        ,SourceFactor      
        ,SourceURL         
        ,[Level]
        ,[View]
        ,RowNumber      
        ,RowNumber2     
        ,Hierarchy         
        ,HierarchyString
        ,HierarchyLevel 
        ,HasChild       
        )
        exec sp_executesql      @sql

        update  #SourcesValues
        set      SourceID                       = @sourceid
                ,SourceTypeID                   = 4
        where   SourceID                        is null

        delete from #Sources
        where ModuleDefinitionSourceID          = @sourceid
end

select  *
from    #SourcesValues
order by SourceTypeID
        ,SourceID

drop table #Sources
drop table #SourcesValues


------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------Stored Procedure Triggers-------------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
select  *
from    tblStoredProcTrigger spt
inner join
        tblStoredProcTriggerParam sptp
on      spt.StoredProcTriggerID                 = sptp.StoredProcTriggerID
where   ModuleID                                = @moduleid


------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------Save store procedure & params-----------------------------------------------------------------------
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
----Main Insert proc for data
--[dbo].[spi_M380_1]
--         @SiteID_xml            XML             = NULL
--        ,@RiskTypeID_xml        XML             = NULL
--        ,@c1E8BCC9E             NVARCHAR(MAX)   = NULL
--        ,@c385D7025             INT             = NULL
--        ,@c3D7380B8             NVARCHAR(MAX)   = NULL
--        ,@c3E7CF6D4             NVARCHAR(MAX)   = NULL
--        ,@c7C5F61F0             INT             = NULL
--        ,@c85B29C24             INT             = NULL
--        ,@cA299231D             NVARCHAR(MAX)   = NULL
--        ,@cAA24747C             INT             = NULL
--        ,@cBCDBB162             DATETIME        = NULL
--        ,@cBF638E94             INT             = NULL
--        ,@UserID                INT
--        ,@Scope                 BIGINT          = NULL OUTPUT

----@SiteID_xml Example
--        /*
--        <st>
--                <s id="" siteId="">
--        </st>
--        */

----@RiskTypeID_xml Example
--        /*
--        <rt>
--                <r id="" riskTypeId="">
--        </rt>
--        */


----Checkboxlist Items Insert proc
--[dbo].[spi_M380_1_CheckboxList]
--         @XML                   XML

--        --Example XML
--        /*
--        <chl>
--                <c id="" moduleDefinitionID="" sourceID="" sourceListID="">
--        </chl>
--        */