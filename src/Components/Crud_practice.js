import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Table, Pagination } from 'react-bootstrap';

function EmployeeTable() {
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [AddshowModal, AddsetShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [newDesignation, setNewDesignation] = useState({ name: '', email: '' });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Adjust number of items per page

  useEffect(() => {
    axios.get('https://localhost:7032/api/Cruds/AddFinancialYear')
      .then(response => {
        setEmployeeData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this item?");
    if (confirmed) {
      axios.delete(`https://localhost:7032/api/Cruds/${id}`)
        .then(() => {
          setEmployeeData(employeeData.filter(employee => employee.id !== id));
        })
        .catch(error => {
          console.error('Error deleting designation:', error);
        });
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setFormData({ name: employee.name, email: employee.email });
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  const AddhandleClose = () => {
    AddsetShowModal(false);
    setNewDesignation({ name: '', email: '' });
  };

  const handleAdd = () => {
    AddsetShowModal(true);
  };

  const handleSaveChanges = () => {
    axios.put(`https://localhost:7032/api/Cruds/${selectedEmployee.id}`, {
      name: formData.name,
      email: formData.email
    })
      .then(() => {
        setEmployeeData(employeeData.map(emp =>
          emp.id === selectedEmployee.id ? { ...emp, name: formData.name, email: formData.email } : emp
        ));
        setShowModal(false);
      })
      .catch(error => {
        console.error('Error updating designation:', error);
      });
  };

  const handleAddDesignation = () => {
    axios.post('https://localhost:7032/api/Cruds', {
      name: newDesignation.name,
      email: newDesignation.email
    })
      .then(response => {
        setEmployeeData([...employeeData, response.data]);
        AddhandleClose();
      })
      .catch(error => {
        console.error('Error adding designation:', error);
      });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNewDesignationChange = (e) => {
    setNewDesignation({ ...newDesignation, [e.target.name]: e.target.value });
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = employeeData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(employeeData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className='m-1 mt-0 p-3'>
      <h1>Employee Information</h1>
      <div>
        <Button
          variant="warning"
          className="btn btn-warning btn-sm mr-2 m-2"
          onClick={handleAdd}
        >
          Add Designation ++
        </Button>
      </div>
      <Table striped bordered hover responsive className='p-2'>
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((employee, index) => (
            <tr key={employee.id}>
              <td>{indexOfFirstItem + index + 1}</td>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>
                <Button
                  variant="warning"
                  className="btn btn-warning btn-sm mr-2 m-2"
                  onClick={() => handleEdit(employee)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(employee.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination>
        <Pagination.Prev
          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
        />
        {[...Array(totalPages).keys()].map(number => (
          <Pagination.Item
            key={number + 1}
            active={number + 1 === currentPage}
            onClick={() => handlePageChange(number + 1)}
          >
            {number + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
        />
      </Pagination>

      {/* Edit Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Designation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Add Modal */}
      <Modal show={AddshowModal} onHide={AddhandleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Designation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNewName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newDesignation.name}
                onChange={handleNewDesignationChange}
                placeholder="Enter new designation name"
              />
            </Form.Group>
            <Form.Group controlId="formNewEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newDesignation.email}
                onChange={handleNewDesignationChange}
                placeholder="Enter new designation email"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={AddhandleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddDesignation}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default EmployeeTable;
