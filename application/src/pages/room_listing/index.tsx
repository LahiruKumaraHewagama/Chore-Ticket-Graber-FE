import React from "react";
import { useGetRooms } from "../../hooks/rooms";
import { RoomType } from "../../types/generated";
import { RoomSearchBar } from "./RoomSearchBar";
import RoomListItem from "./RoomListItem";
import { Box, Typography } from "@mui/material";

function RoomListing() {
  const { fetchRooms, rooms: roomList, loading, error } = useGetRooms();

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "70%" }}>
      <RoomSearchBar searchRooms={fetchRooms} error={error} loading={loading} />
      <Box style={{ background: "rgba(0, 0, 0, 0.5)" , marginLeft:"300px",marginTop:"50px"}} px={1} py={1}>
        {roomList &&
          roomList.map((room: RoomType) => (
            <RoomListItem room={room} key={room.id} />
          ))}
          {!roomList || roomList.length === 0 && (
            <Typography textAlign="center" variant="h5" color="white">
              No Results
            </Typography>
          )}
      </Box>
    </div>
  );
}

export default RoomListing;
