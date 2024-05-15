import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { colors } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { Pie, PieChart, Tooltip } from "recharts";
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.

const MyChart = ({ piedata, input }) => {
  const [pieData, setPieData] = useState([]);
  const [inputTex, setInputText] = useState(null);
  const [expanded, setExpanded] = React.useState([]);

  console.log(piedata);

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

  useEffect(() => {
    if (piedata && piedata.length > 0) {
      const transformedData = piedata.map((entry) => {
        const prompt = entry.prompt;
        const data = entry.data || [];
        console.log(data);
        const formattedData = data.map((item) => ({
          name: item[0], // Assuming name is the first element in the inner arrays
          value: item[1] * 100, // Multiplying by 100 for percentage
        }));
        console.log(formattedData);
        return {
          prompt,
          data: data,
        };
      });

      setPieData(transformedData);
    }
  }, [piedata]);
  console.log(pieData);
  if (!pieData) {
    return null; // Return null if pieData is not yet available
  }
 
  return (
    <div style={{ display: "flex" }}>
      <div>
        {pieData &&
          pieData.map((entry, index) => (
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
                  <PieChart width={1150} height={300} colors={['#82ca9d', '#f56565', '#43a047']}>
                    <Pie
                      data={entry.data}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={110}
                      fill="#82ca9d"
                      label
                    />
                    <Tooltip />
                  </PieChart>
                </AccordionDetails>
              </Accordion>
            </Item>
          ))}
      </div>
    </div>
  );
};
export default MyChart;
