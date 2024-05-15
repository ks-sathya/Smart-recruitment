// ControlledAccordions.js

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import * as React from "react";

const ControlledAccordions = ({ accordionData }) => {
  const [expanded, setExpanded] = React.useState([]);
  console.log(accordionData);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded((prevExpanded) => {
      const newExpanded = [...prevExpanded];
      newExpanded[panel] = isExpanded;
      return newExpanded;
    });
  };

  return (
    <div>
      {accordionData.map((data, index) => (
        <Accordion
          key={index}
          expanded={expanded[index] || false}
          onChange={handleChange(index)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`panel${index + 1}-content`}
            id={`panel${index + 1}-header`}
          >
            <Typography>{data.prompt}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              {Array.isArray(data.result) ? (
                <textarea
                  style={{ width: "400px" }}
                  readOnly
                  rows="10"
                  value={data.result
                    .map((item, index) => `${index + 1}. ${item}`)
                    .join("\n")}
                />
              ) : (
                <div>{data.result}</div>
              )}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default ControlledAccordions;
