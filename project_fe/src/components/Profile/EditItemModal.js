import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

function EditItemModal({ show, onHide, tool, onToolUpdated }) {
  // State variables to manage form inputs
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [image, setImage] = useState(null);

  // Populate form fields with existing tool data when the modal opens
  useEffect(() => {
    if (tool) {
      setItemName(tool.name);
      setDescription(tool.description);
      setDetails(tool.details);
    }
  }, [tool]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare form data to send to the backend
    const formData = new FormData();
    formData.append("name", itemName);
    formData.append("description", description);
    formData.append("details", details);

    // Append image if a new one is selected
    if (image) {
      formData.append("image", image);
    }

    // Update the tool and call the callback on success
    const updatedTool = await updateTool(tool._id, formData);
    if (updatedTool) {
      onToolUpdated(updatedTool); // Notify parent component of changes
      onHide(); // Close the modal after saving changes
    }
  };

  // Function to send a PATCH request to the API for updating the tool
  const updateTool = async (toolId, formData) => {
    try {
      const response = await fetch(
        `https://group-5-project-2.onrender.com/api/tools/${toolId}`,
        {
          method: "PATCH",
          body: formData, // Send form data in the request body
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update tool");
      }
      return await response.json(); // Return updated tool data
    } catch (error) {
      console.error("Error updating tool:", error);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Form to edit the existing item */}
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
            Save Changes
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default EditItemModal;
