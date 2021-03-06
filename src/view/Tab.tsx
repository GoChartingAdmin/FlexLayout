import * as React from "react";
import {Fragment} from "react";
import Actions from "../model/Actions";
import TabNode from "../model/TabNode";
import TabSetNode from "../model/TabSetNode";
import {JSMap} from "../Types";
import {ILayoutCallbacks} from "./Layout";
import {ErrorBoundary} from "./ErrorBoundary";
import {I18nLabel} from "../I18nLabel";

/** @hidden @internal */
export interface ITabProps {
    layout: ILayoutCallbacks;
    selected: boolean;
    node: TabNode;
    factory: (node: TabNode) => React.ReactNode;
}

/** @hidden @internal */
export const Tab = (props: ITabProps) => {
    const {layout, selected, node, factory} = props;
    const [renderComponent, setRenderComponent] = React.useState<boolean>(!props.node.isEnableRenderOnDemand() || props.selected);

    React.useLayoutEffect(() => {
        if (!renderComponent && selected) {
            // load on demand
            // console.log("load on demand: " + node.getName());
            setRenderComponent(true);
        }
    });

    const onMouseDown = () => {
        const parent = node.getParent() as TabSetNode;
        if (parent.getType() === TabSetNode.TYPE) {
            if (!parent.isActive()) {
                layout.doAction(Actions.setActiveTabset(parent.getId()));
            }
        }
    };

    const cm = layout.getClassName;

    const parentNode = node.getParent() as TabSetNode;
    const style: JSMap<any> = node._styleWithPosition({
        display: selected ? "block" : "none"
    });

    if (parentNode.isMaximized()) {
        style.zIndex = 100;
    }

    let child;
    if (renderComponent) {
        child = factory(node);
    }

    return <div className={cm("flexlayout__tab")}
                onMouseDown={onMouseDown}
                onTouchStart={onMouseDown}
                style={style}>
        <ErrorBoundary message={props.layout.i18nName(I18nLabel.Error_rendering_component)}>
            <Fragment>
                {child}
            </Fragment>
        </ErrorBoundary>
    </div>;
};
