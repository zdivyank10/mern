import React, { useEffect, useState } from 'react';
import "../blog/post.css";
import { useAuth } from '../../store/auth';
import DOMPurify from 'dompurify';
import { FaUserAlt } from "react-icons/fa";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { formatDistanceToNow } from 'date-fns';


function Approvedblogs() {
    const { approvedblog, AuthorizationToken ,API_BASE_URL,getApprovedBlogs} = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [selectedBlogId, setSelectedBlogId] = useState(null);
    // const [reasons, setReasons] = useState({
    //     inappropriateContent: false,
    //     inaccurateInformation: false,
    //     outdatedContent: false,
    //     other: false
    // });

    useEffect(() => {
        getApprovedBlogs();
      }, []);
    

    const updatePermission = async (blogId, permission) => {
        try {
            const response = await fetch(`${API_BASE_URL}api/admin/blog/${blogId}/permission`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: AuthorizationToken,
                },
                body: JSON.stringify({ permission })
            });

            if (!response.ok) {
                throw new Error('Failed to update permission');
            }

            const updatedBlog = await response.json();
            console.log('Updated blog:', updatedBlog);
            getApprovedBlogs();
        } catch (error) {
            console.error('Error updating permission:', error);
            // Add UI feedback to inform the user about the error
        }
    };

    const handleDecline = (blogId) => {
        setSelectedBlogId(blogId);
        setShowModal(true);
    };

    const handleConfirmation = () => {
        updatePermission(selectedBlogId, 'false'); // Set permission to 'false'
        setShowModal(false);
        
    };

    // const handleCheckboxChange = (event) => {
    //     const { name, checked } = event.target;
    //     setReasons(prevState => ({
    //         ...prevState,
    //         [name]: checked
    //     }));
    // };
    // const formatDate = (dateString) => {
    //     const date = new Date(dateString);
    //     const day = date.getDate();
    //     const month = date.getMonth() + 1;
    //     const year = date.getFullYear();
    //     return `${day}/${month}/${year}`;
    //   };

      const formatDate1 = (dateString) => {
        const date1 = new Date(dateString);
        return formatDistanceToNow(date1, { addSuffix: true });
      };
    return (
        <>
            <div className="row blogrow">
                <h1 className="text-center">Already Approved Blogs</h1>
                <hr />
                {approvedblog && approvedblog.map((currEle, index) => {
                    const { title, author_id, cover_img, content, tags, createdAt, username, _id } = currEle;
                    const sanitizedContent = DOMPurify.sanitize(content); // Sanitize the content
                    return (
                        <div className="maincontainer col-md-4" key={index}>
                            <div className="postcontainer text-center m-3">
                                <div className="postimg">
                                    <img src={`${API_BASE_URL}uploads/${cover_img}`} height={200} className='banner_img' alt="Cover Image" />
                                </div>
                                <div className="postuserinfo ">
                                    <FaUserAlt className='userpfp' />
                                    <div className="info">
                                    <p>{author_id?.username}</p>

                                        {/* <p>{author_id.username}</p> */}
                                        <p className="blogdate">{formatDate1(createdAt)}</p>
                                    </div>
                                </div>
                                <hr />
                                <div className="blogcontent text-center">
                                    <h2>{title}</h2>
                                    <div className='content' dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                                    <div className="tags">
                                        {tags.map((tag, tagIndex) => (
                                            <span key={tagIndex} className="tag"> {tag} </span>
                                        ))}
                                    </div>
                                    <hr />
                                </div>
                                <div className="actions text-center">
                                    <button className="btn btn-danger" onClick={() => handleDecline(_id)}>Decline</button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Confirmation Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Decline</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <h4>
                    Are You Sure You Want to decline?
                  
                  </h4>
                  {/* Give Reason for the declining Blog: */}
                  {/* <Form.Group controlId="declineReason">
                        <Form.Label>Enter Decline Reason:</Form.Label>
                       <input type="text" className='form-control' required />
                    </Form.Group> */}
                   
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="danger" onClick={handleConfirmation}>Decline</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Approvedblogs;
