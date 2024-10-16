import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function AddItemModal({ show, onHide, userId, onToolAdded }) {
  // State variables to hold input values for the form
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState(null);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data to send to the backend
    const formData = new FormData();
    formData.append("name", itemName);
    formData.append("description", description);
    formData.append("details", details);
    formData.append("owner", userId); // Include the user's ID
    formData.append("available", true); // Set availability status
    formData.append("image", image); // Add image file

    // Create the tool and trigger callback on success
    const createdTool = await createTool(formData);
    if (createdTool) {
      onToolAdded(createdTool); // Notify parent component about the new tool
      onHide(); // Close the modal after adding the item
    }
  };

  // Function to send a POST request to the API for creating a new tool
  const createTool = async (formData) => {
    try {
      const response = await fetch(
        "https://group-5-project-2.onrender.com/api/tools",
        {
          method: "POST",
          body: formData, // Send form data in the request body
        }
      );
      if (!response.ok) {
        throw new Error("Failed to create tool");
      }
      return await response.json(); // Return the created tool data
    } catch (error) {
      console.error("Error creating tool:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Add New Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Form to add new item */}
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Item Name</Form.Label>
            <Form.Control
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Details</Form.Label>
            <Form.Control
              as="textarea"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Add Item
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddItemModal;
