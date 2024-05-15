import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import { BarChart } from "@mui/x-charts/BarChart";
import React, { useState } from "react";

const Line = ({ linedata, input }) => {
  const [chartData, setChartData] = useState([]);
  const [expanded, setExpanded] = React.useState([]);

  console.log(linedata);
  //linedata=linedata[0];
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded((prevExpanded) => {
      const newExpanded = [...prevExpanded];
      newExpanded[panel] = isExpanded;
      return newExpanded;
    });
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  return (
    <div>
      <div>
        {linedata &&
          linedata.map((entry, index) => (
            <Item key={index}>
              <Accordion
                expanded={expanded[index] || false}
                onChange={handleChange(index)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index + 1}-content`}
                  id={`panel${index + 1}-header`}
                >
                  <Typography>{entry.prompt}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <BarChart
                    xAxis={[{ scaleType: "band", data: entry.data.data.map((item) => item[0])}]}
                    series={[{ data: entry.data.data.map((item) => item[1]) }]}
                    //series={[{ data: entry.data.data[0] }]}
                    width={1150}
                    height={300}
                    colors={['#515bb5']}
                  />
                </AccordionDetails>
              </Accordion>
            </Item>
          ))}
      </div>
    </div>
  );
};

export default Line;
