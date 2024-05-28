import React, { useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Asset from "../../components/Asset";
import Upload from "../../assets/upload.jpg";
import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useHistory } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import { useRedirect } from "../../hooks/useRedirect";
import CountryDropdown from "../../components/CountryDropdown";

function PostCreateForm() {
  useRedirect("loggedOut");

  // State variables for form data, file type, and errors
  const [fileType, setFileType] = useState('none');
  const [errors, setErrors] = useState({});
  const [postData, setPostData] = useState({
    title: "",
    location: "",
    content: "",
    media: ""
  });

  const { title, content, location, media } = postData;
  const mediaInput = useRef(null);
  const history = useHistory();

  // Function to handle form field changes
  const handleChange = (event) => {
    const { name, value } = event.target;
    setPostData({
      ...postData,
      [name]: value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
  
    // Initialize an empty object to store errors for each field
    const fieldErrors = {};
    // Validate title field
    if (!title.trim()) {
      fieldErrors.title = ["Title is required"];
    }
    // Validate location field
    if (!location.trim()) {
      fieldErrors.location = ["Location is required"];
    }
    // Validate content field
    if (!content.trim()) {
      fieldErrors.content = ["Content is required"];
    }
    // Validate media field
    if (!media) {
      fieldErrors.media = ["Media is required"];
    }
    // If there are any errors, set the state and return to prevent form submission
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
  
    // If all fields are valid, append them to the formData
    formData.append("title", title);
    formData.append("location", location);
    formData.append("content", content);
    if (fileType === 'image') {
      formData.append("image", mediaInput.current.files[0]);
    } else if (fileType === 'video') {
      formData.append("video", mediaInput.current.files[0]);
    }
  
    try {
      const { data } = await axiosReq.post("/posts/", formData);
      history.push(`/posts/${data.id}`);
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  // Function to handle media file change
  const handleChangeMedia = (event) => {
    if (event.target.files.length) {
      const media = event.target.files[0];
      const fileType = media.type.startsWith('image') ? 'image' : 'video';
      setFileType(fileType);
      setPostData({
        ...postData,
        media: media,
      });
    }
  };

  // JSX for text input fields
  const textFields = (
    <div className="text-center">
      <Form.Group>
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={title}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.title?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Location</Form.Label>
        <CountryDropdown
          onSelectCountry={(country) => setPostData({ ...postData, location: country })}
        />
      </Form.Group>
      {errors?.location?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Form.Group>
        <Form.Label>Content</Form.Label>
        <Form.Control
          as="textarea"
          rows={6}
          name="content"
          value={content}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.content?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>
      ))}
      <Button
        className={`${btnStyles.Button} ${btnStyles.Bright}`}
        onClick={() => history.goBack()}
      >
        Cancel
      </Button>
      <Button
        className={`${btnStyles.Button} ${btnStyles.Bright}`}
        type="submit"
      >
        Create
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        {/* Media upload section */}
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">
              <Form.Label
                className="d-flex flex-column align-items-center"
                htmlFor="media-upload"
              >
                {media && fileType === 'image' ? (
                  <>
                    <img
                      src={URL.createObjectURL(media)}
                      alt="Preview"
                      style={{ maxWidth: "100%", maxHeight: "300px" }}
                    />
                    <div style={{ paddingTop: "5px" }}>
                      <Form.Label
                        className={`${btnStyles.Button} ${btnStyles.Bright} btn`}
                        htmlFor="media-upload"
                      >
                        Change Media
                      </Form.Label>
                    </div>
                  </>
                ) : media && fileType === 'video' ? (
                  <>
                    <video
                      src={URL.createObjectURL(media)}
                      controls
                      style={{ maxWidth: "100%", maxHeight: "300px" }}
                    />
                    <div style={{ paddingTop: "5px" }}>
                      <Form.Label
                        className={`${btnStyles.Button} ${btnStyles.Bright} btn`}
                        htmlFor="media-upload"
                      >
                        Change Media
                      </Form.Label>
                    </div>
                  </>
                ) : (
                  <Asset
                    src={Upload}
                    message="Click or tap to upload an image or video"
                  />
                )}
              </Form.Label>
              <Form.File
                id="media-upload"
                accept="image/*,video/*"
                onChange={handleChangeMedia}
                ref={mediaInput}
              />
            </Form.Group>
            {errors?.media?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
          <Container className={appStyles.Content}>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
}

export default PostCreateForm;
