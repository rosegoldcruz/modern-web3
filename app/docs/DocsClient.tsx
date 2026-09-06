"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, Search, Menu, X } from "lucide-react";
import { docs } from "./data";
import styles from "./docs.module.css";

export function DocsClient() {
  const [search, setSearch] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  const filteredDocs = useMemo(() => {
    if (!search.trim()) return docs;
    const term = search.toLowerCase();
    return docs.filter(
      (doc) =>
        doc.title.toLowerCase().includes(term) ||
        doc.content.toLowerCase().includes(term) ||
        doc.category.toLowerCase().includes(term)
    );
  }, [search]);

  const currentDoc = filteredDocs.find((d) => d.id === activeSection) || filteredDocs[0];

  const toc = useMemo(() => {
    if (!currentDoc) return [];
    const headings = currentDoc.content.match(/^#+\s+(.+)$/gm) || [];
    return headings.map((h) => {
      const level = h.match(/^#+/)?.[0]?.length ?? 2;
      const text = h.replace(/^#+\s+/, "");
      return { level, text, id: text.toLowerCase().replace(/\s+/g, "-") };
    });
  }, [currentDoc]);

  return (
    <div className={styles.docsRoot}>
      <div className={styles.docsContainer}>
        {/* Sidebar Navigation */}
        <aside className={`${styles.sidebar} ${mobileNavOpen ? styles.mobileOpen : ""}`}>
          <div className={styles.sidebarHead}>
            <h2>Documentation</h2>
            <button
              className={styles.closeNav}
              onClick={() => setMobileNavOpen(false)}
              aria-label="Close navigation"
            >
              <X size={20} />
            </button>
          </div>

          {/* Search */}
          <div className={styles.searchBox}>
            <Search size={18} />
            <input
              type="search"
              placeholder="Search docs..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (filteredDocs.length > 0) {
                  setActiveSection(filteredDocs[0].id);
                }
              }}
              className={styles.searchInput}
            />
          </div>

          {/* Navigation */}
          <nav className={styles.sidebarNav}>
            {filteredDocs.map((doc) => (
              <button
                key={doc.id}
                onClick={() => {
                  setActiveSection(doc.id);
                  setMobileNavOpen(false);
                }}
                className={`${styles.navItem} ${activeSection === doc.id ? styles.active : ""}`}
              >
                <span className={styles.navCategory}>{doc.category}</span>
                <span className={styles.navTitle}>{doc.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.main}>
          {/* Mobile Menu Button */}
          <div className={styles.mobileMenuBar}>
            <button
              className={styles.openNav}
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={20} />
            </button>
            <Link href="/swap" className={styles.swapCta}>
              Swap IV-SOL <ChevronRight size={16} />
            </Link>
          </div>

          {/* Content Area */}
          <div className={styles.content}>
            {currentDoc ? (
              <>
                <div className={styles.docHeader}>
                  <span className={styles.category}>{currentDoc.category}</span>
                  <h1>{currentDoc.title}</h1>
                  <p className={styles.description}>{currentDoc.description}</p>
                </div>

                <div className={styles.docBody} dangerouslySetInnerHTML={{ __html: currentDoc.html }} />
              </>
            ) : (
              <div className={styles.noResults}>
                <p>No documentation found for "{search}"</p>
              </div>
            )}
          </div>

          {/* Right TOC */}
          {currentDoc && toc.length > 0 && (
            <aside className={styles.toc}>
              <nav>
                <p className={styles.tocTitle}>On this page</p>
                <ul>
                  {toc.map((heading) => (
                    <li key={heading.id} style={{ marginLeft: `${(heading.level - 2) * 12}px` }}>
                      <a href={`#${heading.id}`}>{heading.text}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
          )}
        </main>
      </div>

      {/* Footer CTA */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div>
            <h3>Ready to swap?</h3>
            <p>Get verified IV-SOL through Jupiter</p>
          </div>
          <Link href="/swap" className={styles.primaryButton}>
            Swap IV-SOL <ChevronRight size={16} />
          </Link>
        </div>
      </footer>
    </div>
  );
}
