import {Menu} from "antd";
import {Link} from "react-router-dom";
import React from "react";
import * as PropTypes from "prop-types";

export function AppMenu(props) {
    return <Menu style={{textAlign: "center"}} selectedKeys={[props.route]} mode="horizontal">
        <Menu.Item key="/">
            <Link onClick={props.onClick} to="/">YourContract</Link>
        </Menu.Item>
        <Menu.Item key="/hints">
            <Link onClick={props.onClick1} to="/hints">Hints</Link>
        </Menu.Item>
        <Menu.Item key="/exampleui">
            <Link onClick={props.onClick2} to="/exampleui">ExampleUI</Link>
        </Menu.Item>
        <Menu.Item key="/subgraph">
            <Link onClick={props.onClick3} to="/subgraph">Subgraph</Link>
        </Menu.Item>
    </Menu>;
}

AppMenu.propTypes = {
    route: PropTypes.any,
    onClick: PropTypes.func,
    onClick1: PropTypes.func,
    onClick2: PropTypes.func,
    onClick3: PropTypes.func
};
