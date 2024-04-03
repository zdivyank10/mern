import React, { useEffect, useState } from 'react';
import "../blog/post.css";
import { useAuth } from '../../store/auth';
import DOMPurify from 'dompurify';
import { FaUserAlt } from "react-icons/fa";
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Pendingblogs() {
  const { user, AuthorizationToken, API_BASE_URL, pendingblog,getPendingBlogs } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [blogId, setBlogId] = useState(null);
  const [action, setAction] = useState(null); // 'approve' or 'decline'

  
  useEffect(() => {
    getPendingBlogs();
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
      getPendingBlogs();
    } catch (error) {
      console.error('Error updating permission:', error);
      // Add UI feedback to inform the user about the error
    }
  };

  const handleShowModal = (blogId, action) => {
    setBlogId(blogId);
    setAction(action);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setBlogId(null);
    setAction(null);
    setShowModal(false);
  };

  const handleApprove = (blogId) => {
    handleShowModal(blogId, 'approve');
  };

  const handleDecline = (blogId) => {
    handleShowModal(blogId, 'decline');
  };

  // Check if there are no pending blogs
  // const noPendingBlogs = blog.every(currEle => currEle.permission !== 'pending');

  { if (pendingblog.length === 0) {
    return (
        <>
        <div className="text-center">

        <img src="https://cdn.dribbble.com/users/3008811/screenshots/7090670/media/5a61f4778d6a527572a773c1f69001b8.gif" alt="" height={450} className='mt-3 m-3' />

        <h3 className='m-3'>- No Pending blogs found-</h3>
        <Link to={`/admin`} className='btn btn-dark'> Go back</Link> 
        </div>
        </>
    )
}}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
  return (
    <>
      <div className="row blogrow">
        <h1 className="text-center">All Pending Blogs</h1>
        <hr />
        {pendingblog && pendingblog.map((currEle, index) => {
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
                    <p className="blogdate">{formatDate(createdAt)}</p>
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
                {/* <div className="actions text-center">
                  <button className="btn btn-success" onClick={() => handleApprove(_id)}>Approve</button>
                </div> */}
                <div className="actions text-center">
                    <button className="btn btn-success me-3" onClick={() => handleApprove(_id)}>Approve</button>
                    <button className="btn btn-danger" onClick={() => handleDecline(_id)}>Decline</button>
                  </div>
              </div>
            </div>
          );
        })}

      </div>
      {/* {noPendingBlogs && <h1 className='text-center text-danger'>No Pending Blogs</h1>} */}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm {action === 'approve' ? 'Approval' : 'Decline'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to {action === 'approve' ? 'approve' : 'decline'} this blog?
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
          <button className={`btn ${action === 'approve' ? 'btn-success' : 'btn-danger'}`} onClick={() => {
            handleCloseModal();
            action === 'approve' ? updatePermission(blogId, 'true') : updatePermission(blogId, 'false');
          }}>{action === 'approve' ? 'Approve' : 'Decline'}</button>
        </Modal.Footer>
      </Modal>
    </>
  );


}

export default Pendingblogs;
{/* <div className="actions text-center">
                    <button className="btn btn-success me-3" onClick={() => handleApprove(_id)}>Approve</button>
                    <button className="btn btn-danger" onClick={() => handleDecline(_id)}>Decline</button>
                  </div> */}