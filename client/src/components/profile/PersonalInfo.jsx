import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider
} from "@mui/material";
import {
  Person,
  Email,
  CalendarToday,
  Lightbulb
} from "@mui/icons-material";

const PersonalInfo = ({ user }) => {
  return (
    <Card elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 600 }}>
          <Person sx={{ mr: 1, color: 'primary.main' }} />
          Personal Information
        </Typography>
        <List dense sx={{ '& .MuiListItem-root': { px: 0 } }}>
          <ListItem>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Email sx={{ color: 'primary.main' }} />
            </ListItemIcon>
            <ListItemText 
              primary={<Typography fontWeight="500">Email</Typography>}
              secondary={user.email || "Not provided"} 
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <CalendarToday sx={{ color: 'primary.main' }} />
            </ListItemIcon>
            <ListItemText 
              primary={<Typography fontWeight="500">Member since</Typography>}
              secondary={user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Not available"} 
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          <ListItem>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Lightbulb sx={{ color: 'primary.main' }} />
            </ListItemIcon>
            <ListItemText 
              primary={<Typography fontWeight="500">Learning Motivation</Typography>}
              secondary={user.reasonForLearning || user.learningMotivation || "Not specified"} 
            />
          </ListItem>
        </List>
      </CardContent>
    </Card>
  );
};

export default PersonalInfo;