import React, { useEffect, useState } from 'react';
import '../blog/adminblog.css';
import { useAuth } from '../../store/auth';
import DOMPurify from 'dompurify';
import { Pagination, Dropdown, DropdownButton } from 'react-bootstrap';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { GiImperialCrown } from "react-icons/gi";
import { Link } from 'react-router-dom';

function AdminEditor() {
    const { approvedblog, AuthorizationToken, getApprovedBlogs } = useAuth();
    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 10; // Number of items per page

    useEffect(() => {
        getApprovedBlogs();
    }, []);

    const indexOfLastItem = activePage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = approvedblog.slice(indexOfFirstItem, indexOfLastItem).filter(blog => !blog.choice);

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
    };

    const makeEditorsChoice = async(blogId) => {
        console.log("Making blog with ID", blogId, "an editor's choice...");
        try {
            const response = await fetch(`${process.env.API_BASE_URL}api/admin/choice`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: AuthorizationToken,
                },
                body: JSON.stringify({ blogid: blogId, choice: "true" })
            });
            const edtrchoice = await response.json();
            console.log('choice blog:', edtrchoice);
            // After making the blog an editor's choice, you might want to refresh the list of approved blogs
            getApprovedBlogs();
        } catch (error) {
            console.log('Error Making editors choice', Error);
        }
    };

    return (
        <>
            <Link to={`/admin/alreadyeditor`} className='btn btn-dark'><GiImperialCrown size={25 } />  Already Editor's Choice</Link>
            <h1 className='home_left_h1 text-center'>Make it Editor's Choice</h1>
            <div className="pagination-container align-items-center justify-content-center">
                <hr />
                <table className="table  table-hover ">
                    <thead>
                        <tr>
                            <th scope="col">Title</th>
                            <th scope="col">Username</th>
                            <th scope="col">Image</th>
                            <th scope="col">Tags</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((curEle, index) => (
                            <tr key={index} className='p-3'>
                                <td>{curEle.title}</td>
                                <td>{curEle.author_id?.username}</td>
                                <td>
                                    <img src={`${process.env.API_BASE_URL}uploads/${curEle.cover_img}`} height={80} width={120} alt="Cover Image" />
                                </td>
                                <td>
                                    {curEle.tags.map((tag, tagIndex) => (
                                        <span key={tagIndex} className="tag"> {tag} </span>
                                    ))}
                                </td>
                                <td>
                                    <DropdownButton id={`dropdown-button-${index}`} title={<HiOutlineDotsVertical />} className='text-dark' >
                                        <Dropdown.Item onClick={() => makeEditorsChoice(curEle._id)}><GiImperialCrown size={20}/> Add To Editor's Choice</Dropdown.Item>
                                    </DropdownButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Pagination>
    {approvedblog.length > itemsPerPage && (
        <Pagination.Prev
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
        />
    )}
    {Array.from({ length: Math.ceil(approvedblog.length / itemsPerPage) }).map((_, index) => (
        <Pagination.Item
            key={index + 1}
            active={index + 1 === activePage}
            onClick={() => handlePageChange(index + 1)}
        >
            {index + 1}
        </Pagination.Item>
    ))}
    {approvedblog.length > itemsPerPage && (
        <Pagination.Next
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage === Math.ceil(approvedblog.length / itemsPerPage)}
        />
    )}
</Pagination>

            </div>
        </>
    );
}

export default AdminEditor;
