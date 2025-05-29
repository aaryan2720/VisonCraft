import { useState } from 'react';
import React from 'react';
import './Blogs.css';

function Blogs() {
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');

  const posts = [
    {
      title: 'Post Title 1',
      excerpt: 'This is a short excerpt of the post content to engage readers.',
      date: '20 May 2025',
      author: 'John Doe',
    },
    {
      title: 'Post Title 2',
      excerpt: 'This is a short excerpt of the post content to engage readers.',
      date: '20 May 2025',
      author: 'Jane Smith',
    },
  ];

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
    <div>
      {/* Header */}
      <div className="header">
        <div className="logo">DOCNISH</div>
        <h1>Insights & Stories</h1>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search News, Blogs"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* About Section */}
      <div className="about-section">
        <h1>About</h1>
        <p>Small Information</p>
      </div>

      {/* Posts Container */}
      <div className="posts-container">
        <div className="posts-left">
          {/* View Toggle */}
          <div className="view-toggle">
            <button
              className={view === 'grid' ? 'active' : ''}
              onClick={() => setView('grid')}
            >
              Grid
            </button>
            <button
              className={view === 'list' ? 'active' : ''}
              onClick={() => setView('list')}
            >
              List
            </button>
          </div>

          {/* Posts Grid/List */}
          <div
            className={`posts-grid ${view === 'grid' ? 'grid-view' : 'list-view'}`}
            id="postsGrid"
          >
            {filteredPosts.map((post, index) => (
              <div className="post-card" key={index} data-title={post.title}>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <p>
                  Date: {post.date} | Author: {post.author}
                </p>
                <button>Read More</button>
              </div>
            ))}
          </div>

          {/* Featured Media */}
          <div className="featured-media-section">
            <h3>Featured Media</h3>
            <div className="media-placeholder">Media Placeholder</div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="posts-right">
          {/* Categories */}
          <div className="sidebar-section">
            <h3>Categories</h3>
            <ul>
              <li><a href="#">News</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Update</a></li>
            </ul>
          </div>

          {/* Recent Posts */}
          <div className="sidebar-section">
            <h3>Recent Posts</h3>
            <div>
              <p>RECENT POST TITLE</p>
              <p>Date: 20 May 2025</p>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="sidebar-section newsletter-section">
            <h3>Newsletter Signup</h3>
            <input type="text" placeholder="Your name" />
            <input type="email" placeholder="Your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="alerts-section">
        <h3>Get Instant Alerts</h3>
        <input type="email" placeholder="Enter Your Email for Alerts" />
        <button>Sign Up for Alerts</button>
      </div>
    </div>
    </>
  );
}

export default Blogs;
