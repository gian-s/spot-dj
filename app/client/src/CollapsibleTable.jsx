import * as React from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Dashboard from "./Dashboard";

function createData(playlist_id, playlist_name) {
  return {
    playlist_id,
    playlist_name,
    tracks: [],
  };
}

function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>

        </TableCell>
        <TableCell component="th" scope="row">
          {row.playlist_id}
        </TableCell>
        
        <TableCell>{row.playlist_name}</TableCell>



      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Tracks
              </Typography>
              <Table size="small" aria-label="tracks">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">id</TableCell>
                    <TableCell align="left">Track Name</TableCell>
                    <TableCell align='left'>BPM</TableCell>
                    <TableCell align='left'>Key</TableCell>
                    <TableCell align='left'>Energy</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {row.tracks.map((tracksRow) => (
                    <TableRow key={tracksRow.track_id}>
                      <TableCell component="th" scope="row">
                        {tracksRow.track_id} 
                      </TableCell>
                      <TableCell>{tracksRow.track_name}</TableCell>
                      <TableCell>{tracksRow.track_tempo}</TableCell>
                      <TableCell>{tracksRow.track_key}</TableCell>
                      <TableCell>{tracksRow.track_energy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}



export default function CollapsibleTable({ code }) {
  const rows = Dashboard(code);
  //console.log("Inside COmponent")
  //console.log(rows);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Playlist ID</TableCell>
            <TableCell>Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.playlist_name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
