import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import { axiosRes } from "../../api/axiosDefaults";

import styles from "../../styles/CommentCreateEditForm.module.css";

function CommentEditForm(props) {
  const { id, content, setShowEditForm, setComments } = props;

  const [formContent, setFormContent] = useState(content);

  // Function to handle changes in the textarea
  const handleChange = (event) => {
    setFormContent(event.target.value);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Send a put request to update the comment
      await axiosRes.put(`/comments/${id}/`, {
        content: formContent.trim(),
      });

      // Update comments state to reflect the edited comment
      setComments((prevComments) => ({
        ...prevComments,
        results: prevComments.results.map((comment) => {
          return comment.id === id
            ? {
                ...comment,
                content: formContent.trim(),
                updated_at: "now",
              }
            : comment;
        }),
      }));

      // Hide the edit form after submission
      setShowEditForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  // JSX for rendering the comment edit form
  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="pr-1">
        <Form.Control
          className={styles.Form}
          as="textarea"
          value={formContent}
          onChange={handleChange}
          rows={2}
        />
      </Form.Group>
      <div className="text-right">
        <button
          className={styles.Button}
          onClick={() => setShowEditForm(false)}
          type="button"
        >
          cancel
        </button>
        <button
          className={styles.Button}
          disabled={!content.trim()}
          type="submit"
        >
          save
        </button>
      </div>
    </Form>
  );
}

export default CommentEditForm;
