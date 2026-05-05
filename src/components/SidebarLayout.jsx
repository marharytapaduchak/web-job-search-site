import './SidebarLayout.css'

const SidebarLayout = ({ topSlot, title, children, bottomSlot }) => {
    return (
        <aside className="filter-sidebar">
            
            {topSlot}

            {title && <h2 className="filters-main-title">{title}</h2>}

            <div className="filters-scroll-container">
                {children}
            </div>

            {bottomSlot}

        </aside>
    );
};

export default SidebarLayout;
