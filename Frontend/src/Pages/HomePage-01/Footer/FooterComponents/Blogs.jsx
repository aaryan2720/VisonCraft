import { useState } from 'react';
import React from 'react';
import './Blogs.css';

function Blogs() {
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const posts = [
    {
      id: 1,
      title: 'Digital Document Management: Transforming Business Operations',
      excerpt: 'How cloud-based document solutions are revolutionizing the way businesses store, manage, and access their critical documents.',
      date: '28 May 2025',
      author: 'Sarah Johnson',
      category: 'Digital Solutions',
      readTime: '5 min read',
      image: 'https://via.placeholder.com/400x250/0d3e7e/ffffff?text=Document+Management',
      tags: ['Digital Transformation', 'Cloud Storage', 'Business Solutions']
    },
    {
      id: 2,
      title: 'Legal Document Compliance: Best Practices Guide',
      excerpt: 'Essential strategies for ensuring your business documents meet regulatory requirements and legal standards.',
      date: '25 May 2025',
      author: 'Michael Chen',
      category: 'Legal Compliance',
      readTime: '4 min read',
      image: 'https://via.placeholder.com/400x250/0d3e7e/ffffff?text=Legal+Compliance',
      tags: ['Legal Documents', 'Compliance', 'Business Law']
    },
    {
      id: 3,
      title: 'Document Security in the Digital Age',
      excerpt: 'Advanced security measures and encryption technologies to protect your sensitive business documents from cyber threats.',
      date: '22 May 2025',
      author: 'Emily Rodriguez',
      category: 'Security',
      readTime: '7 min read',
      image: 'https://via.placeholder.com/400x250/0d3e7e/ffffff?text=Document+Security',
      tags: ['Cybersecurity', 'Data Protection', 'Digital Security']
    },
    {
      id: 4,
      title: 'Streamlining Contract Management Process',
      excerpt: 'Efficient workflows and automated systems for managing contracts, agreements, and legal documentation.',
      date: '20 May 2025',
      author: 'James Wilson',
      category: 'Contract Management',
      readTime: '6 min read',
      image: 'https://via.placeholder.com/400x250/0d3e7e/ffffff?text=Contract+Management',
      tags: ['Contracts', 'Automation', 'Workflow']
    },
    {
      id: 5,
      title: 'Document Digitization: From Paper to Digital',
      excerpt: 'Complete guide to converting physical documents into digital formats while maintaining quality and accessibility.',
      date: '18 May 2025',
      author: 'Lisa Park',
      category: 'Digitization',
      readTime: '5 min read',
      image: 'https://via.placeholder.com/400x250/0d3e7e/ffffff?text=Document+Digitization',
      tags: ['Digitization', 'Document Scanning', 'Digital Archive']
    },
    {
      id: 6,
      title: 'Business Process Optimization Through Document Automation',
      excerpt: 'How automated document workflows can reduce processing time and improve operational efficiency.',
      date: '15 May 2025',
      author: 'Robert Kim',
      category: 'Automation',
      readTime: '4 min read',
      image: 'https://via.placeholder.com/400x250/0d3e7e/ffffff?text=Document+Automation',
      tags: ['Automation', 'Business Process', 'Efficiency']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Posts', count: posts.length },
    { id: 'digital-solutions', name: 'Digital Solutions', count: posts.filter(p => p.category === 'Digital Solutions').length },
    { id: 'legal-compliance', name: 'Legal Compliance', count: posts.filter(p => p.category === 'Legal Compliance').length },
    { id: 'security', name: 'Security', count: posts.filter(p => p.category === 'Security').length },
    { id: 'contract-management', name: 'Contract Management', count: posts.filter(p => p.category === 'Contract Management').length },
    { id: 'digitization', name: 'Digitization', count: posts.filter(p => p.category === 'Digitization').length },
    { id: 'automation', name: 'Automation', count: posts.filter(p => p.category === 'Automation').length }
  ];

  const recentPosts = posts.slice(0, 4);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
                           post.category.toLowerCase().replace(' ', '-') === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Header */}
      <div className="header">
        <div className="logo">DOCNISH</div>
        <div className="header-content">
          <h1>Document Solutions & Insights</h1>
          <p>Expert insights on digital document management and business consultancy</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search document solutions, legal guides, automation tips..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Your Trusted Document Consultancy Partner</h1>
          <p>Empowering businesses with comprehensive document management solutions, legal compliance guidance, 
             and digital transformation services. Join thousands of companies who trust Docnish for their document needs.</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Documents Processed</span>
            </div>
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Happy Clients</span>
            </div>
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">Service Categories</span>
            </div>
          </div>
        </div>
      </div>

      {/* Posts Container */}
      <div className="posts-container">
        <div className="posts-left">
          {/* View Toggle & Results Count */}
          <div className="posts-header">
            <div className="results-info">
              <span>{filteredPosts.length} document guides found</span>
            </div>
            <div className="view-toggle">
              <button
                className={view === 'grid' ? 'active' : ''}
                onClick={() => setView('grid')}
              >
                📱 Grid
              </button>
              <button
                className={view === 'list' ? 'active' : ''}
                onClick={() => setView('list')}
              >
                📄 List
              </button>
            </div>
          </div>

          {/* Posts Grid/List */}
          <div className={`posts-grid ${view === 'grid' ? 'grid-view' : 'list-view'}`}>
            {filteredPosts.map((post) => (
              <article className="post-card" key={post.id}>
                <div className="post-image">
                  <img src={post.image} alt={post.title} />
                  <div className="post-category">{post.category}</div>
                </div>
                <div className="post-content">
                  <h3>{post.title}</h3>
                  <p className="post-excerpt">{post.excerpt}</p>
                  <div className="post-tags">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="tag">#{tag}</span>
                    ))}
                  </div>
                  <div className="post-meta">
                    <div className="post-author">
                      <span>👤 {post.author}</span>
                      <span>📅 {post.date}</span>
                    </div>
                    <div className="post-read-time">
                      <span>⏱️ {post.readTime}</span>
                    </div>
                  </div>
                  <button className="read-more-btn">Read Full Guide →</button>
                </div>
              </article>
            ))}
          </div>

          {/* Featured Media */}
          <div className="featured-media-section">
            <h3>📺 Featured Resources</h3>
            <div className="media-grid">
              <div className="media-item">
                <div className="media-placeholder">
                  <span>🎥 Latest Webinar</span>
                  <p>Document Management Best Practices</p>
                </div>
              </div>
              <div className="media-item">
                <div className="media-placeholder">
                  <span>📊 Compliance Guide</span>
                  <p>Legal Document Requirements 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="posts-right">
          {/* Categories */}
          <div className="sidebar-section categories-section">
            <h3>📂 Categories</h3>
            <ul>
              {categories.map((category) => (
                <li key={category.id}>
                  <button
                    className={selectedCategory === category.id ? 'active' : ''}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name} <span className="count">({category.count})</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Posts */}
          <div className="sidebar-section recent-posts-section">
            <h3>🕒 Recent Posts</h3>
            {recentPosts.map((post) => (
              <div key={post.id} className="recent-post">
                <div className="recent-post-image">
                  <img src={post.image} alt={post.title} />
                </div>
                <div className="recent-post-content">
                  <h4>{post.title}</h4>
                  <p>📅 {post.date}</p>
                  <p>👤 {post.author}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Newsletter Signup */}
          <div className="sidebar-section newsletter-section">
            <h3>📧 Stay Updated</h3>
            <p>Get the latest document management insights and compliance updates delivered to your inbox weekly.</p>
            <form className="newsletter-form">
              <input type="text" placeholder="Your full name" required />
              <input type="email" placeholder="Your email address" required />
              <div className="checkbox-group">
                <input type="checkbox" id="privacy" required />
                <label htmlFor="privacy">I agree to the privacy policy</label>
              </div>
              <button type="submit">Subscribe Now 📨</button>
            </form>
            <div className="newsletter-benefits">
              <p>✅ Weekly document insights</p>
              <p>✅ Exclusive compliance guides</p>
              <p>✅ Early access to resources</p>
            </div>
          </div>

          {/* Popular Tags */}
          <div className="sidebar-section tags-section">
            <h3>🏷️ Popular Topics</h3>
            <div className="tag-cloud">
              <span className="cloud-tag">Document Management</span>
              <span className="cloud-tag">Legal Compliance</span>
              <span className="cloud-tag">Digital Transformation</span>
              <span className="cloud-tag">Contract Management</span>
              <span className="cloud-tag">Business Automation</span>
              <span className="cloud-tag">Data Security</span>
              <span className="cloud-tag">Document Digitization</span>
              <span className="cloud-tag">Process Optimization</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="alerts-section">
        <div className="alerts-content">
          <h3>🚨 Get Instant Business Updates</h3>
          <p>Be the first to know about important regulatory changes, compliance updates, and new document solutions</p>
          <div className="alerts-form">
            <input type="email" placeholder="Enter your email for business alerts" />
            <button>Sign Up for Alerts 🔔</button>
          </div>
          <div className="alerts-features">
            <span>⚡ Real-time notifications</span>
            <span>📋 Compliance updates</span>
            <span>📢 Service announcements</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blogs;