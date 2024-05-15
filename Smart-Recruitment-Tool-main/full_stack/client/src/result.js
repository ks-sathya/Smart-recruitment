
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Button, Col, Form, FormGroup, Input, Label, Row } from "reactstrap";
import "./App.css";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { styled } from "@mui/material/styles";
import ControlledAccordions from "./ControlledAccordions";
import Instructions from "./Instructions";
import { Stack } from "@mui/material";
import Bar from "./Bar";
import Line from "./Line";
import MyChart from "./Pie";
import Example from "./Table";
import "./result.css"

function Result(props) {
  const [inputText, setInputText] = useState("");
  const [promptCount, setPromptCount] = useState(0); // State to track prompt count
  const [result, setResult] = useState(null);
  const [accordionData, setAccordionData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [accordion, setAccordion] = useState(-1);
  const navigate = useNavigate();
  // const [expanded, setExpanded] = useState({});
  const [originalData, setOriginalData] = useState(null);
  const [pieData, setPieData] = useState([]);
  const [LineData, setLineData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [rowd, setRows] = useState([]);
  const [barData, setBarData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [inputPrompt, setInputPrompt] = useState([]);
  const [expanded, setExpanded] = React.useState([]);

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

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleLogout = async () => {
    // Perform your logout logic here
    try {
      const response = await axios.post("http://localhost:5000/logout");
      if (typeof props.token === "function") {
        props.token(); // Assuming this function is responsible for handling the token
      }
      navigate("/");
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Axios error:", error);
    }
  };

  function toggleAccordion(index) {
    setAccordion((prevState) => (prevState === index ? -1 : index));
  }

  const handleInputChange = (e) => {
    e.preventDefault();
    setInputText(e.target.value);
  };

  const handlePromptClick = async (prompt) => {
    setInputText(prompt);
    try {
      const token = localStorage.getItem("token"); // Replace 'yourTokenKey' with the actual key you use to store the token
      const response = await axios.post(
        "http://localhost:5000/process_text",
        {
          text: prompt,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + props.token,
          },
        }
      );
      // const { result, total_length } = response.data;
      console.log(response.data);
      console.log(typeof response.data.result);
      let resultString = response.data.result; // Change variable name to avoid confusion
      if (typeof response.data.result === "string") {
        if (
          resultString.startsWith('{"answer": "') &&
          resultString.endsWith('"}')
        ) {
          const answerText = resultString.substring(
            11,
            resultString.length - 2
          );
          const newAccordionData = [
            ...accordionData,
            { prompt: inputText, result: answerText },
          ];
          setAccordionData(newAccordionData);
          setAccordionData(newAccordionData);
          setResult(answerText);
          setPromptCount((prevCount) => prevCount + 1);
        }
        if (resultString.startsWith('{"table":')) {
          console.log(resultString);
        }
        if (resultString.startsWith('{"pie":')) {
          const parsedData = JSON.parse(resultString);
          console.log(parsedData);
          // Extract the data array from the parsed JSON
          const originalData = parsedData.pie.data;
          console.log(originalData);
          // Create a new formatted array
          const formattedData = originalData.map((item) => ({
            name: item[0],
            value: item[1] * 1000, // You can adjust the multiplier based on your specific needs
          }));
          setPieData(originalData);
          console.log(formattedData);
        }
        if (resultString.startsWith('{"bar":')) {
          const parsedData = JSON.parse(resultString);
          console.log(parsedData);
          // Extract the data array from the parsed JSON
          const originalData = parsedData.bar;
          console.log(originalData);
          // Create a new formatted array
          setLineData(originalData);
        }
        if (resultString.startsWith('{"line":')) {
          const parsedData = JSON.parse(resultString);
          console.log(parsedData);
          // Extract the data array from the parsed JSON
          const originalData = parsedData.line;
          console.log(originalData);
          // Create a new formatted array
          setBarData(originalData);
        }
        // let responseString = response.data.result; // Change variable name to avoid confusion
        // responseString = responseString.replace(/^{"answer": "|"}$/g, ""); // Remove leading and trailing quotes, curly brackets
        // setResult(responseString);

        // } else if (response.data.result.hasOwnProperty("pie")) {
        //   // Handle pie chart case
        //   const pieChartData = response.data.result.pie;
        //   // Process pieChartData...
        // } else if (response.data.result.hasOwnProperty("line")) {
        //   // Handle line chart case
        //   const lineChartData = response.data.result.line;
        //   // Process lineChartData...
        // } else if (response.data.result.hasOwnProperty("bar")) {
        //   // Handle bar chart case
        //   const barChartData = response.data.result.bar;
        //   // Process barChartData...
        // } else if (response.data.result.hasOwnProperty("table")) {
        //   // Handle table case
        //   const tableData = response.data.result.table;
        //   // Process tableData...
      } else {
        setResult([response.data.result]); // If not a string, treat it as a single item array
      }
      console.log(result);
      // console.log(newAccordionData);
    } catch (error) {
      console.error("Error sending request to the backend:", error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(
        "http://localhost:5000/process_text",
        {
          text: inputText,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + props.token,
          },
        }
      );
      console.log(response.type)
      console.log(response.data.result);
      if (response.data.result !== undefined) {
        console.log("HHII")
        let resultString = response.data.result;
        console.log(resultString); // Change variable name to avoid confusion
        if (typeof resultString === "object") {
          console.log(resultString)
          if (resultString.hasOwnProperty("answer")) {
            const answerText = String(resultString.answer)
            console.log(answerText);
            setResult(answerText);
            const newAccordionData = [
              { prompt: inputText, result: answerText },
              ...accordionData,
            ];
            setAccordionData(newAccordionData);
            console.log(accordionData);
          }
          if (resultString.hasOwnProperty("table")) {
            console.log(resultString.table.answer.columns);
            // console.log(parsedData);
            const cols = resultString.table.answer.columns;
            const rows = resultString.table.answer.data;
            console.log(rows);
            setColumns(cols);
            const ROW = resultString.table.answer.data.map((row, index) => ({
              id: index + 1,
              ...Object.fromEntries(
                cols.map((col, i) => [
                  col.toLowerCase().replace(" ", "_"),
                  row[i],
                ])
              ),
            }));
            setRows(ROW);
            console.log(ROW);
            console.log(columns);
            setInputPrompt(inputText);
            setTableData((prevTableData) => [
              ...prevTableData,
              { prompt: inputText, row: ROW, column: cols },
            ]);
          }
          if (resultString.hasOwnProperty("pie")) {
            let ans=resultString.pie.answer;
            // Extract the data array from the parsed JSON
            const originalData = resultString.pie;
            const columns = ans.columns;
            const data = ans.data;
            
            console.log(columns);
  
            // Create a new formatted array
            const formattedData = data.map((entry) => ({
              name: entry[0], // Use the first element as the "name"
              value: entry[1] , // Use the second element as the "value" (adjusted by a multiplier if needed)
            }));
  
            console.log(formattedData);
            setInputPrompt(inputText);
            setPieData((prevPieData) => [
              ...prevPieData,
              { prompt: inputText, data: formattedData },
            ]);
            console.log(pieData);
          }
          if (resultString.hasOwnProperty("bar")) {
            console.log("PI kKK ")
            const ans = resultString.bar.answer;
          
            // Extract the data array from the parsed JSON
            const originalData=resultString.bar.answer;
            let data=ans.data;
            // Create a new formatted array
            console.log(originalData);
            const formattedData = data.map((entry) => ({
              name: entry[0], // Use the first element as the "name"
              value: entry[1] , // Use the second element as the "value" (adjusted by a multiplier if needed)
            }));
            // Create a new formatted array
            setLineData((prevBarData) => [
              ...prevBarData,
              { prompt: inputText, data: originalData},
            ]);
            //console.log(LineData);
          }
          if (resultString.hasOwnProperty("line")) {
            console.log("line kkk")
            //const parsedData = JSON.parse(resultString);
            //console.log(parsedData);
            // Extract the data array from the parsed JSON
            const originalData = resultString.line.answer;
            console.log(originalData);
            // Create a new formatted array
            // setBarData(originalData);
            setBarData((prevBarData) => [
              ...prevBarData,
              { prompt: inputText, data: originalData },
            ]);
            console.log(barData);
            // console.log(inputPrompt);
          }
        } else {
          setResult([response.data.result]); // If not a string, treat it as a single item array
        }
      } else {
        toast.error("Please try again");
      }
    } catch (error) {
      toast.error("Please try again");
      console.log(error.response.data.msg);
      console.error(
        "Error sending request to the backend:",
        error.response.data.msg
      );
    }
  };
  const renderAccordionItems = () => {
    if (accordionData && accordionData.length > 0) {
      return <ControlledAccordions accordionData={accordionData} />;
    } else {
      return null; // Or you can render a message or anything else when accordionData is null or empty
    }
  };

  const renderTableItems = () => {
    // console.log(columns);
    if (columns && rowd && columns.length > 0) {
      console.log(rowd);
      return (
        <Example
          data={tableData}
        />
      );
    } else {
      return null; // Or you can render a message or anything else when accordionData is null or empty
    }
  };

  const renderPieItems = () => {
    // console.log(pieData);
    if (pieData && pieData.length > 0) {
      console.log(pieData);
      return <MyChart input={inputPrompt} piedata={pieData} />;
    } else {
      return null; // Or you can render a message or anything else when accordionData is null or empty
    }
  };

  const renderLineItems = () => {
    console.log(LineData);
    if (LineData) {
      const latestEntry = accordionData[accordionData.length - 1];
      console.log(LineData);
      return <Line input={accordionData} linedata={LineData} />;
    } else {
      return null; // Or you can render a message or anything else when accordionData is null or empty
    }
  };

  const renderBarItems = () => {
    // console.log(barData);
    if (barData) {
      const latestEntry = accordionData[accordionData.length - 1];
      console.log(barData);
      return <Bar input={inputPrompt} barData={barData} />;
    } else {
      return null; // Or you can render a message or anything else when accordionData is null or empty
    }
  };

  const prompts = [
    "How many Candidates are from Mumbai?",
    "Table the names and email of employees from bangalore.",
    "Pie chart of number of employees based on their location",
    "Bar Chart of number of employees in each location based on their role",
    // "Create a table where you give me the name of employees and experience of employees whose role is Cyber security and location is bangalore",
  ];
  return (
    <div className="result-page">
      <div
        style={{
          display: "flex",
          justifyContent: "right",
          justifyItems: "right",
          margin: "1rem",
        }}
      >
        <Instructions />
        <Button
          style={{ marginLeft: "1rem", backgroundColor:'#cf1338'}}
          color="danger"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
      <Grid
        Grid
        container
        flexDirection={"row"}
        spacing={{ xs: 2, md: 3 }}
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <Row style={{ display: "flex" , margin: "1rem" }}>
          <Col style={{ flex: 1 }}>
            <Grid item xs={12} rowSpacing={1}>
              <Label>Recommended Prompts:</Label>
              <Stack direction="row" spacing={4}>
                {prompts.map((prompt, index) => (
                  <Row
                    xs="4"
                    key={index}
                    style={{ marginBottom: "0.5rem", cursor: "pointer" }}
                    onClick={() => {
                      handlePromptClick(prompt);
                      document.getElementById("submitForm").click();
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: "auto",
                        padding: "10px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        cursor: "pointer",
                        textDecoration: "underline",
                        color: "blue",
                      }}
                    >
                      {prompt}
                    </div>
                  </Row>
                ))}
              </Stack>
            </Grid>

            {/* Column 2 for Form */}
            <Grid item xs={12}>
              <Form id="submitForm" onSubmit={handleFormSubmit}>
                <FormGroup>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <Label>Enter your prompt:</Label>
                  </div>
                  <div style={{display:"flex"}}>
                  <Input
                    style={{ width: "90%",marginRight:"12px", height: "auto" }}
                    type="textarea"
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="Enter Your Query"
                  />
                <Button type="submit" style={{background:'#7dff69',paddingRight:'20px',paddingLeft:'20px', borderRadius:'20px'}}>
                  Submit
                </Button>
                </div>
                </FormGroup>
              </Form>
            </Grid>
          </Col>
        </Row>
        
        {accordionData && 
        pieData && 
        tableData &&
        barData &&
        LineData && (<Row >
        <Col>
          <Grid item xs={12}>
            <Item>
              {accordionData && renderAccordionItems()}
              {pieData && renderPieItems()}
              {/* OR */}
              {/* {renderAccordionItems()} */}
              {/* OR */}
              {tableData && renderTableItems()}
              {/* OR */}
              {barData && renderLineItems()}
              {/* OR */}
              {LineData && renderBarItems()}
            </Item>
            {/* {result && (
              <Item>
                <div>
                  <div style={{ marginBottom: "0.5rem" }}>
                    <Label>Result</Label>
                  </div>
                  <textarea
                    style={{ width: "400px" }}
                    readOnly
                    rows="10"
                    value={
                      Array.isArray(result) // Check if result is an array
                        ? result
                            .map((item, index) => `${index + 1}. ${item}`)
                            .join("\n")
                        : result.substring(1)
                    } // If not an array, use the result as is
                  />
                </div>
              </Item>
            )} */}
          </Grid>
        </Col>
      </Row>)}
      </Grid>
      <ToastContainer />
    </div>
  );
}

export default Result;