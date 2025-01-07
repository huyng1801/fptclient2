import React, { useState, useEffect } from "react";
import { Card, Avatar, Typography } from "antd";
import { AccessTime } from "@mui/icons-material";
import { format } from "date-fns";
import UserService from "../../services/UserService"; // Assuming you have UserService to fetch user data

const { Text } = Typography;

const ReplyList = ({ replies }) => {
  const [users, setUsers] = useState({}); // State to store user info by userId

  // Sort replies by creation date (newest first)
  const sortedReplies = [...replies].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Fetch user information for each reply
  useEffect(() => {
    const fetchUsers = async () => {
      const userPromises = sortedReplies.map(
        (reply) => UserService.getUser(reply.authorId) // Assuming this API call fetches user info based on authorId
      );
      const userResponses = await Promise.all(userPromises);

      const usersData = userResponses.reduce((acc, user, index) => {
        acc[sortedReplies[index].authorId] = user; // Store users by their authorId
        return acc;
      }, {});

      setUsers(usersData);
    };

    fetchUsers();
  }, [sortedReplies]); // Re-run when replies change

  return (
    <div style={{ marginTop: "16px" }}>
      {sortedReplies.map((reply) => {
        const user = users[reply.authorId]; // Get user data by authorId

        return (
          <Card
            key={reply.commentId}
            style={{
              marginBottom: "12px",
              padding: "16px",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <Avatar
                size={40}
                src={
                  user
                    ? user.profilePicture
                    : "https://via.placeholder.com/300x300"
                }
              >
                {user ? user.firstName.charAt(0) : "U"}
              </Avatar>
              <div>
                <Text strong>
                  {user ? `${user.firstName} ${user.lastName}` : "Unknown User"}
                </Text>
                <br />
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  <AccessTime style={{ fontSize: 12 }} />{" "}
                  {format(new Date(reply.createdAt), "dd/MM/yyyy")}
                </Text>
              </div>
            </div>
            <div style={{ marginTop: "8px", paddingLeft: "40px" }}>
              {reply.content}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ReplyList;
