import React, { useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import Image from "react-bootstrap/Image";
import styles from "../../styles/PostCreateEditForm.module.css";
import appStyles from "../../App.module.css";
import btnStyles from "../../styles/Button.module.css";
import { useHistory, useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import CountryDropdown from "../../components/CountryDropdown";

function PostEditForm() {
  const [errors, setErrors] = useState({});
  const [postData, setPostData] = useState({
    title: "",
    location: "",
    content: "",
    media: "",
    mediaType: "",
    initialMediaType: "",
  });
  const [initialMediaType, setInitialMediaType] = useState("");
  const { title, location, content, media, mediaType } = postData;
  const mediaInput = useRef(null);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/posts/${id}/`);
        const { title, location, content, image, video, is_owner } = data;
  
        let initialMediaType = "";

        if (video !== null) {
          initialMediaType = "video";
        } else {
          initialMediaType = "image";
        }

        setInitialMediaType(initialMediaType);
  
        console.log("Initial media type:", initialMediaType);
        const source = initialMediaType === 'video' ? video : image;

        setInitialMediaType(initialMediaType);
  
        is_owner
          ? setPostData({
              title,
              location,
              content,
              media: source,
              mediaType: initialMediaType,
            })
          : history.push("/");
      } catch (err) {
        console.log(err);
      }
    };
  
    handleMount();
  }, [history, id]);

  const handleChange = (event) => {
    setPostData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleChangeMedia = (event) => {
    setErrors({ ...errors, media: [] });
  
    if (event.target.files.length) {
      const media = event.target.files[0];
      const fileType = media.type.startsWith("image") ? "image" : "video";
      console.log("fileType:", fileType);
  
      setInitialMediaType(fileType);
  
      setPostData({
        ...postData,
        media: URL.createObjectURL(media),
        mediaType: fileType,
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
  
    formData.append("title", title);
    formData.append("location", location);
    formData.append("content", content);
  
    if (mediaInput?.current?.files[0]) {
      formData.append(mediaType === "image" ? "image" : "video", mediaInput.current.files[0]);
    } else {
      formData.append(mediaType === "image" ? "image" : "video", postData.media);
    }
  
    try {
      await axiosReq.put(`/posts/${id}/`, formData);
      history.push(`/posts/${id}`);
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

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
      {errors?.title?.map((idx) => (
        <Alert variant="warning" key={idx}>
          Title is required
        </Alert>
      ))}

      <Form.Group>
        <Form.Label>Location</Form.Label>
        <CountryDropdown
          onSelectCountry={(country) =>
            setPostData({ ...postData, location: country })
          }
          defaultValue={location}
        />
      </Form.Group>
      {errors?.location?.map((idx) => (
        <Alert variant="warning" key={idx}>
          Location is required
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
      {errors?.content?.map((idx) => (
        <Alert variant="warning" key={idx}>
          Content is required
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
        Save
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container
            className={`${appStyles.Content} ${styles.Container} d-flex flex-column justify-content-center`}
          >
            <Form.Group className="text-center">
              <div>
                {initialMediaType === "video" ? (
                  <video maxWidth="100%" maxHeight="300px" key="video-key" controls
                    style={{ maxWidth: "100%", maxHeight: "300px" }}>
                    <source src={media} />
                  </video>
                ) : (
                  <Image 
                    className={appStyles.Image}
                    style={{ maxWidth: "100%", maxHeight: "300px", paddingBottom: "5px" }}
                    src={media} />
                )}
              </div>
              <div>
                <Form.Label
                  className={`${btnStyles.Button} ${btnStyles.Bright} btn`}
                  htmlFor="media-upload"
                >
                  Change Media
                </Form.Label>
              </div>
              <Form.File
                id="media-upload"
                accept="image/*,video/*"
                onChange={handleChangeMedia}
                ref={mediaInput}
              />
            </Form.Group>
            {errors?.media?.map((idx) => (
              <Alert variant="warning" key={idx}>
                {mediaType === "image" ? "Image" : "Video"} is required
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

export default PostEditForm;
