/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-useless-escape */
import React, { useEffect, useState } from "react";
import Alert from "@mui/material/Alert";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import EditIcon from "@mui/icons-material/Edit";
import { Modal } from "antd";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { Popconfirm } from "antd";
import "./App.css";
function App() {
  const [rows, setRows] = useState([]);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [id, setId] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  function handleUpdate(e) {
    setName(e.name);
    setEmail(e.email);
    setPhone(e.phone);
    setAge(e.age);
    setId(e.id);
    setOpen(true);
  }
  function handleSubmit() {
    if (name === "" || email === "" || phone === "" || age === "") {
      setError("All the fields are required");
    } else if (
      !email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ) 
    ) {
      setError("Invalid Email address");
    } else if (
      phone.match(/\d/g).length !== 10 &&
      !phone.match(
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
      )
    ) {
      setError("Invalid Phone Number address");
    } else if (age === "0") {
      setError("Age cannot be 0");
    } else {
      setError("");
      submitData({ name: name, email: email, phone: phone, age: age });
    }
  }

  const confirmDelete = (e) => {
    console.log(e);
    fetch("/admin/" + e.id, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "DELETE",
    })
      .then(function (res) {
        if (res.status === 200) {
          apiData();
        }
      })
      .catch(function (res) {
        setError("Error occured!!");
      });
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setName("");
    setEmail("");
    setPhone("");
    setAge("");
    setId("");
    setError("");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const update = () => {
    if (name === "" || email === "" || phone === "" || age === "") {
      setError("All the fields are required");
    } else if (
      !email.match(
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    ) {
      setError("Invalid Email address");
    } else if (
      phone.match(/\d/g).length !== 10 &&
      !phone.match(
        /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im
      )
    ) {
      setError("Invalid Phone Number address");
    } else if (age === "0") {
      setError("Age cannot be 0");
    } else {
      setError("");
      updateData({ name: name, email: email, phone: phone, age: age }, id);
    }
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  function createData(id, name, email, phone, age) {
    return { id, name, email, phone, age };
  }
  useEffect(() => {
    apiData();
  }, []);
  useEffect(() => {
    if (search !== "") {
      let result = data.filter((e) => {
            return e.name.match(search) || e.email.match(search);
          });
      if (result.length > 0) {
        setRows(
          result.map((i) => {
            return createData(i._id, i.name, i.email, i.phone, i.age);
          })
        );
        setColumns(
          Object.keys(result[0])
            .filter((i) => {
              return i !== "_id" && i !== "__v";
            })
            .map((i) => {
              return {
                id: i,
                label: i.toUpperCase(),
              };
            })
        );
      } else {
        apiData();
      }
    } else {
      apiData();
    }
  }, [search]);
  function apiData() {
    fetch("https://vast-ruby-worm-wrap.cyclic.app/get")
      .then((res) => res.json())
      .then(
        (result) => {
          setData(result);
          setRows(
            result.map((i) => {
              return createData(i._id, i.name, i.email, i.phone, i.age);
            })
          );
          setColumns(
            Object.keys(result[0])
              .filter((i) => {
                return i !== "_id" && i !== "__v";
              })
              .map((i) => {
                return {
                  id: i,
                  label: i.toUpperCase(),
                };
              })
          );
        },
        (error) => {
          console.log(error);
        }
      );
  }

  async function submitData(e) {
    await fetch("https://vast-ruby-worm-wrap.cyclic.app/admin", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(e),
    })
      .then(function (res) {
        if (res.status === 200) {
          apiData();
          setOpen(false);
          setName("");
          setEmail("");
          setPhone("");
          setAge("");
          setId("");
        }
      })
      .catch(function (res) {
        setError("Error occured!!");
      });
  }
  async function updateData(e, id) {
    await fetch("https://vast-ruby-worm-wrap.cyclic.app/admin/" + id, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(e),
    })
      .then(function (res) {
        if (res.status === 200) {
          apiData();
          setOpen(false);
          setName("");
          setEmail("");
          setPhone("");
          setAge("");
          setId("");
        }
      })
      .catch(function (res) {
        setError("Error occured!!");
      });
  }

  return (
    <div className="App">
      <Modal
        onOk={open}
        onCancel={handleClose}
        open={open}
        footer={[
          <Button
            onClick={id !== "" ? update : handleSubmit}
            variant="outlined"
          >
            {id !== "" ? "Update" : "Submit"}
          </Button>,
        ]}
      >
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 2 },
          }}
          noValidate
          autoComplete="off"
        >
          {error !== "" && (
            <Alert style={{ marginTop: "25px" }} severity="error">
              {error} — check it out!
            </Alert>
          )}
          <div>
            <TextField
              required
              id="standard-required"
              label="Name"
              variant="standard"
              value={name}
              defaultValue={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              required
              id="standard-required"
              type="email"
              label="Email"
              variant="standard"
              value={email}
              defaultValue={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              required
              id="standard-required"
              type="number"
              label="Phone Number"
              variant="standard"
              value={phone}
              defaultValue={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <TextField
              required
              id="standard-required"
              type="number"
              label="Age"
              variant="standard"
              value={age}
              defaultValue={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
        </Box>
      </Modal>
      <nav style={{ backgroundColor: "#fff" }}>
        <h1 style={{ padding: "0 10px" }}>User Dashboard</h1>
        <div
          style={{
            float: "right",
            position: "absolute",
            top: "10px",
            right: "10px",
          }}
        >
          <div class="search-container">
            <form action="/search" method="get">
              <input
                className="search expandright"
                id="searchright"
                type="search"
                name="q"
                onChange={(e) => {
                  console.log(e.target.value);
                  setSearch(e.target.value);
                }}
                placeholder="Search"
              />
              <label class="button searchbutton" for="searchright">
                <span class="mglass">&#9906;</span>
              </label>
            </form>
          </div>
        </div>
      </nav>
      <div className="addButton">
        <Button variant="outlined" color="primary" onClick={handleOpen}>
          <AddCircleOutlineIcon /> Add User
        </Button>
      </div>
      <div className="mainTable">
        <TableContainer sx={{ maxHeight: 800 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <>
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.code}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <>
                              <TableCell key={column.id} align={column.align}>
                                {column.format && typeof value === "number"
                                  ? column.format(value)
                                  : value}
                              </TableCell>
                            </>
                          );
                        })}
                        <TableCell>
                          <IconButton
                            onClick={() => handleUpdate(row)}
                            variant="text"
                          >
                            <EditIcon />
                          </IconButton>
                          <Popconfirm
                            title="Are you sure to delete the user?"
                            onConfirm={() => confirmDelete(row)}
                            onCancel={(e) => console.log(e)}
                            okText="Yes"
                            cancelText="No"
                          >
                            <IconButton variant="text">
                              <DeleteIcon />
                            </IconButton>
                          </Popconfirm>
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </div>
  );
}

export default App;
