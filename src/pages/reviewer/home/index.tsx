import { DataGridList } from "@/components/DataGrid/DataGridList";
import { ISource } from "@/Libs/type";
import {  Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import ReviewerNavbar from "../ReviewerNavbar";

/**
 * ReviewHome component renders the home page for the reviewer.
 * It displays a welcome banner, an abstracts summary, and tasks management
 * for the Global Healthcare Innovations Summit 2024.
 * 
 * The component includes:
 * - A logo and avatar in the navigation bar.
 * - A welcome message for the reviewer.
 * - A summary of abstracts with statistics on total, pending, reviewed,
 *   approved, and rejected abstracts.
 * - Tabs for different categories of abstracts.
 * - A DataGrid for detailed information.
 */


const ReviewerHome = () => {


    const [source, setSource] = useState<ISource | undefined>(undefined);

    const [currentTab, setCurrentTab] = useState(0);

    const columns = [
        { type: "default", field: "id", headerName: "ID", width: 150 },
        {
            type: "default",
            field: "name",
            headerName: "Event Name",
            width: 200,
        },
        { type: "default", field: "eventClass", headerName: "Type", width: 150 },
        {
            type: "dateField",
            field: "createdOn",
            headerName: "Created Date",
            width: 200,
            dateFormat: "DD/MM/YYYY",
        },
        {
            type: "dateField",
            field: "startTime",
            headerName: "Start Date",
            width: 200,
            dateFormat: "DD/MM/YYYY",
        },
        { type: "status", field: "statusId", headerName: "Status", width: 150, sortable: false }
    ];

    useEffect(() => {
        abstractList();
    }, [])

    const abstractList = useCallback(() => {
        const req = {
            offset: 0,
            limit: 5,
            sortBy: "id",
            sortDirection: "DESC",

        };

        setSource({
            method: "POST",
            data: req,
            url: `userAbstract/list`,
            listName: "abstractList",
        });
        return;
    }, []);

    const tabs = ["Total Abstracts", "Pending for Review", "Reviewed Abstracts", "Approved", "Rejected"]

    const summaryData = [{
        id: 1,
        title: "Total Abstracts",
        value: 100
    }, {

        id: 2,
        title: "Pending for Review",
        value: 10
    },
    {
        id: 3,
        title: "Reviewed Abstracts",
        value: 10
    },
    {
        id: 4,
        title: "Approved",
        value: 10
    },
    {
        id: 5,
        title: "Rejected",
        value: 10
    }

    ]

    const handleClick = (index: number) => {
        setCurrentTab(index)
    }

    return (
        <Box className="reviewer-main reviewer-home-main">

            <ReviewerNavbar />

            <Grid container justifyContent={"center"}>

                <Grid size={11} className="banner-container">
                    <Typography className="banner-title">Welcome, Dr. Emily Carter! 👋</Typography>
                    <Typography className="banner-subtitle">Manage your tasks for Global Healthcare Innovations Summit 2024.</Typography>
                </Grid>

                <Grid size={11} className="abstracts-summary-container">

                    <Typography className="abstracts-summary-title">
                        Abstracts Summary
                    </Typography>

                    <Box className="abstracts-summary-content">
                        {
                            summaryData.map((item: typeof summaryData[0], index: number) => {
                                return (
                                    <>
                                        <SummaryCard key={item.id} title={item.title} value={item.value} />
                                        {index === summaryData.length - 1 ? null : <Box className="divider"></Box>}

                                    </>
                                )
                            })
                        }
                    </Box>

                    <Box className="review-tabs">
                        {
                            tabs.map((tab, index) => {

                                return (
                                    <TabButton onclick={() => handleClick(index)} key={index} text={tab} active={index === currentTab} />
                                )
                            })
                        }

                    </Box>

                    <Box className="data-grid-container">
                        <DataGridList
                            columns={columns}
                            source={source}
                            id="reviewer-datagrid"

                            title="Event"
                            noRecordSubtitle="No abstracts found"
                            hideFooterPagination={false}
                        />
                    </Box>

                </Grid>
            </Grid>
        </Box>
    )
}

export default ReviewerHome


const TabButton = ({ text, active, onclick }: { text: string, active: boolean, onclick: () => void }) => {

    return (
        <Box onClick={onclick} className={clsx("item", active && "active")}>
            <Typography className={clsx("abstracts-summary-content-title", active && "text-active")}>{text}</Typography>
        </Box>
    )

}


const SummaryCard = ({ title, value }: { title: string; value: number }) => {
    return (
        <Box>
            <Typography className="abstracts-summary-content-title">{title} </Typography>
            <Typography className="abstracts-summary-content-value">{value}</Typography>
        </Box>
    );
};