import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import React from "react";

import { useMemo } from "react";

const Example = ({ data }) => {
  const [expanded, setExpanded] = React.useState([]);

  // should be memoized or stable
  console.log(data);

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

  return data.map((entry, index) => {
    const cols = entry.column || [];
    const row = entry.row || [];

    const memoizedColumns = useMemo(
      () =>
        cols.map((col) => ({
          accessorKey: col.toLowerCase().replace(" ", "_"),
          header: col,
          size: 50,
        })),
      [cols]
    );

    const table = useMaterialReactTable({
      columns: memoizedColumns,
      data: row,
    });

    return (
      <div key={index} style={{ height: "50%", width: "50%" }}>
        {/* Adjust the height value according to your requirement */}
        <Item>
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
              <MaterialReactTable table={table} />
            </AccordionDetails>
          </Accordion>
        </Item>
      </div>
    );
  });
};

export default Example;
