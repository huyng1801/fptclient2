import React, { useState } from "react";
import { Container, Row, Col, Button, Card, Form } from "react-bootstrap";
import { Box, Typography, TextField } from "@mui/material";


import {
  DesktopDateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const RequestDetailPage = () => {
  const requestDetails = {
    name: "Nguyen Van A",
    requestDetails: "Nguyen Van A cần giúp đỡ",
  };

  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [comment, setComment] = useState("");

  const handleSetSchedule = () => {
    alert("Đặt lịch thành công !");
  };

  const handleCompleteRequest = () => {
    alert("Hoàn thành !");
  };

  return (
    <div className="d-flex flex-column min-vh-100">

      <Box sx={{ paddingTop: "70px", backgroundColor: "#f9f9f9", py: 4 }}>
        <Container>
          <Row className="mb-4">
            <Col>
              <Typography
                variant="h4"
                align="center"
                className="mb-4"
                style={{ fontWeight: "bold", color: "#FFB400" }}
              >
                Chi Tiết Yêu Cầu
              </Typography>
            </Col>
          </Row>
          <Card className="mb-4 shadow-sm">
            <Card.Body>
              <Typography variant="h6" className="mb-3 text-primary">
                {requestDetails.name}
              </Typography>
              <Typography variant="h6" className="mb-3">
                Chi tiết yêu cầu:
              </Typography>
              <Typography variant="body1">
                {requestDetails.requestDetails}
              </Typography>
            </Card.Body>
          </Card>

          <Row className="d-flex justify-content-center">
            <Col md={6} className="mb-4">
              <Typography variant="h6" className="mb-3">
                Phản hồi:
              </Typography>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Write your message here..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Col>
          </Row>
          <Row className="d-flex justify-content-center">
            <Col md={6} className="mb-4">
              <Typography variant="h6" className="mb-3">
                Chọn lịch hẹn:
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDateTimePicker
                  label="Pick a Date and Time"
                  value={selectedDateTime}
                  onChange={(newValue) => setSelectedDateTime(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col className="text-center">
              <Button
                variant="primary"
                className="me-3"
                onClick={handleSetSchedule}
              >
                Đặt lịch hẹn
              </Button>
              <Button variant="success" onClick={handleCompleteRequest}>
                Hoàn thành
              </Button>
            </Col>
          </Row>
        </Container>
      </Box>

    </div>
  );
};

export default RequestDetailPage;
