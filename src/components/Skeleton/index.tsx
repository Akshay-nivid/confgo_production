/*
*@sarath
Fx Skelton component 
extends from the Material Skelton and 
enhances for the airbase requirements
*/
import React from "react";
import { Card, CardHeader, CardContent, Skeleton, SkeletonProps } from "@mui/material";
import clsx from "clsx";

//default skelton
export const Skeletn: React.FC<SkeletonProps> = props => {
  return (
    <Card className={props.className ? props.className : "fx-skelton"}>
      <CardHeader
        avatar={
          <Skeleton animation="wave" variant="circular" width={40} height={40} />

        }
        title={
          <><Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />
            <Skeleton animation="wave" height={10} width="60%" style={{ marginBottom: 6 }} />
          </>
        }
      />
      <Skeleton animation="wave" variant="rectangular" height={props.height && props.height} />
      <CardContent>
        <React.Fragment>
          <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
          <Skeleton animation="wave" height={10} width="80%" />
        </React.Fragment>
      </CardContent>
    </Card>

  )
}

//skelton for the datagrid list
export const SkeletonList: React.FC<SkeletonProps> = props => {
  let maxHight: number = 20.5;
  if (props.height) {
    try {
      maxHight = parseInt(props.height + "".replace('rem', ''))
    } catch (e) { }
  }


  const rows_hight = 45 * 0.0625;
  let rowCount: any = Math.floor((maxHight) / rows_hight);
  let rows: any = [];
  for (let i = 1; i <= rowCount; i++) {
    rows.push(i);
  }
  return (
    <Card className={clsx("fx-skelton", props?.className)} style={{'width': props.width || '100%' }}>
      <table width="100%">
        {/* card header 40px height */}
        <tr>
          <td width="15%" >
            <CardHeader
              title={
                <><Skeleton animation="wave" height={16} width="80%" /></>
              }
            /> </td>
          <td ><CardContent><Skeleton animation="wave" /></CardContent></td>
          <td width="15%"><CardContent><Skeleton animation="wave" /></CardContent></td>
          <td width="15%"><CardContent><Skeleton animation="wave" /></CardContent></td>
        </tr>
        {/* card list items height 44px  */}
        {
          rows.map(() => {
            return (
              <tr>
                <td >
                  <CardHeader
                    title={
                      <><Skeleton animation="wave" height={16} width="80%" /></>
                    }
                  />
                </td>
                <td ><CardContent><Skeleton animation="wave" /></CardContent></td>
                <td ><CardContent><Skeleton animation="wave" /></CardContent></td>
                <td><CardContent><Skeleton animation="wave" /></CardContent></td>
              </tr>

            )
          })
        }
      </table>
    </Card>

  )
}