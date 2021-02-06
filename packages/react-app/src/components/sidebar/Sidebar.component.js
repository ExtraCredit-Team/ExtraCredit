/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import React from "react";
import {Link, NavLink as NavLinkRRD} from "react-router-dom";
// nodejs library to set properties for components
import {PropTypes} from "prop-types";
// reactstrap components
import {
    Col,
    Collapse,
    Container,
    DropdownItem,
    DropdownMenu,
    DropdownToggle,
    Form,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Media,
    Nav,
    Navbar,
    NavbarBrand,
    NavItem,
    NavLink,
    Row,
    UncontrolledDropdown
} from "reactstrap";

const routes = [
    {
        path: "/index",
        name: "Dashboard",
        icon: "fas fa-chart-line text-primary",
    },
    {
        path: "/delegate-credit",
        name: "Delegate Credit",
        icon: "fab fa-bitcoin text-blue",
    },
    {
        path: "/borrower",
        name: "Borrower",
        icon: "far fa-handshake text-orange",
    },
    {
        path: "/ethereum",
        name: "Show eth tools",
        icon: "fab fa-ethereum text-orange",
    },
    {
        path: "/old-menu",
        name: "Plain Scaffold App",
        icon: "fas fa-bolt text-black",
    },
    {
        path: "/exampleui",
        name: "Plain Scaffold App",
        icon: "fas fa-hand-holding text-green",
    },
    {
        path: "/creditpool-ui",
        name: "Credit Pool",
        icon: "fas fa-coins text-yellow",
    },
    {
        path: "/marginpool-ui",
        name: "Margin Pool",
        icon: "fas fa-plane text-yellow",
    },
    {
        path: "/interestrates",
        name: "Interest Rates Stats",
        icon: "fas fa-plane text-green",
    },
    {
        path: "/homesubgraph",
        name: "SubGraph",
        icon: "fas fa-plane text-orange",
    }
];



class Sidebar extends React.Component {
    state = {
        collapseOpen: false
    };

    constructor(props) {
        super(props);
        this.activeRoute.bind(this);
    }

    // verifies if routeName is the one active (in browser input)
    activeRoute(routeName) {
        return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
    }

    // toggles collapse between opened and closed (true/false)
    toggleCollapse = () => {
        this.setState({
            collapseOpen: !this.state.collapseOpen
        });
    };
    // closes the collapse
    closeCollapse = () => {
        this.setState({
            collapseOpen: false
        });
    };
    // creates the links that appear in the left menu / Sidebar
    createLinks = routes => {
        return routes.map((prop, key) => {
            return (
                <NavItem key={key}>
                    <NavLink
                        to={prop.path}
                        tag={NavLinkRRD}
                        onClick={this.closeCollapse}
                        activeClassName="active"
                    >
                        <i className={prop.icon}/>
                        {prop.name}
                    </NavLink>
                </NavItem>
            );
        });
    };

    render() {
        const {bgColor, logo} = this.props;
        let navbarBrandProps;
        if (logo && logo.innerLink) {
            navbarBrandProps = {
                to: logo.innerLink,
                tag: Link
            };
        } else if (logo && logo.outterLink) {
            navbarBrandProps = {
                href: logo.outterLink,
                target: "_blank"
            };
        }
        return (
            <Navbar
                className="navbar-vertical fixed-left navbar-light bg-white"
                expand="md"
                id="sidenav-main"
            >
                <Container fluid>
                    {/* Toggler */}
                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={this.toggleCollapse}
                    >
                        <span className="navbar-toggler-icon"/>
                    </button>
                    {/* Brand */}
                    {logo ? (
                        <NavbarBrand className="pt-0" {...navbarBrandProps}>
                            <img
                                alt={logo.imgAlt}
                                className="navbar-brand-img"
                                src={logo.imgSrc}
                            />
                        </NavbarBrand>
                    ) : null}
                    {/* User */}
                    <Nav className="align-items-center d-md-none">
                        <UncontrolledDropdown nav>
                            <DropdownToggle nav className="nav-link-icon">
                                <i className="ni ni-bell-55"/>
                            </DropdownToggle>
                            <DropdownMenu
                                aria-labelledby="navbar-default_dropdown_1"
                                className="dropdown-menu-arrow"
                                right
                            >
                                <DropdownItem>Action</DropdownItem>
                                <DropdownItem>Another action</DropdownItem>
                                <DropdownItem divider/>
                                <DropdownItem>Something else here</DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        <UncontrolledDropdown nav>
                            <DropdownToggle nav>
                                <Media className="align-items-center">
                                    <span className="avatar avatar-sm rounded-circle">img</span>
                                </Media>
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                                <DropdownItem className="noti-title" header tag="div">
                                    <h6 className="text-overflow m-0">Welcome!</h6>
                                </DropdownItem>
                                <DropdownItem to="/admin/user-profile" tag={Link}>
                                    <i className="ni ni-single-02"/>
                                    <span>My profile</span>
                                </DropdownItem>
                                <DropdownItem to="/admin/user-profile" tag={Link}>
                                    <i className="ni ni-settings-gear-65"/>
                                    <span>Settings</span>
                                </DropdownItem>
                                <DropdownItem to="/admin/user-profile" tag={Link}>
                                    <i className="ni ni-calendar-grid-58"/>
                                    <span>Activity</span>
                                </DropdownItem>
                                <DropdownItem to="/admin/user-profile" tag={Link}>
                                    <i className="ni ni-support-16"/>
                                    <span>Support</span>
                                </DropdownItem>
                                <DropdownItem divider/>
                                <DropdownItem href="#pablo" onClick={e => e.preventDefault()}>
                                    <i className="ni ni-user-run"/>
                                    <span>Logout</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </Nav>
                    {/* Collapse */}
                    <Collapse navbar isOpen={this.state.collapseOpen}>
                        {/* Collapse header */}
                        <div className="navbar-collapse-header d-md-none">
                            <Row>
                                {logo ? (
                                    <Col className="collapse-brand" xs="6">
                                        {logo.innerLink ? (
                                            <Link to={logo.innerLink}>
                                                <img alt={logo.imgAlt} src={logo.imgSrc}/>
                                            </Link>
                                        ) : (
                                            <a href={logo.outterLink}>
                                                <img alt={logo.imgAlt} src={logo.imgSrc}/>
                                            </a>
                                        )}
                                    </Col>
                                ) : null}
                                <Col className="collapse-close" xs="6">
                                    <button
                                        className="navbar-toggler"
                                        type="button"
                                        onClick={this.toggleCollapse}
                                    >
                                        <span/>
                                        <span/>
                                    </button>
                                </Col>
                            </Row>
                        </div>
                        {/* Form */}
                        <Form className="mt-4 mb-3 d-md-none">
                            <InputGroup className="input-group-rounded input-group-merge">
                                <Input
                                    aria-label="Search"
                                    className="form-control-rounded form-control-prepended"
                                    placeholder="Search"
                                    type="search"
                                />
                                <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                        <span className="fa fa-search"/>
                                    </InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                        </Form>
                        {/* Navigation */}
                        <Nav navbar>{this.createLinks(routes)}</Nav>
                        {/* Divider */}
                        <hr className="my-3"/>
                    </Collapse>
                </Container>
            </Navbar>
        );
    }
}

Sidebar.defaultProps = {
    routes: [{}]
};

Sidebar.propTypes = {
    // links that will be displayed inside the component
    routes: PropTypes.arrayOf(PropTypes.object),
    logo: PropTypes.shape({
        // innerLink is for links that will direct the user within the app
        // it will be rendered as <Link to="...">...</Link> tag
        innerLink: PropTypes.string,
        // outterLink is for links that will direct the user outside the app
        // it will be rendered as simple <a href="...">...</a> tag
        outterLink: PropTypes.string,
        // the image src of the logo
        imgSrc: PropTypes.string.isRequired,
        // the alt for the img
        imgAlt: PropTypes.string.isRequired
    })
};

export default Sidebar;
