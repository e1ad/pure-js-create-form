import {clickOutside, map, noop, styleElement} from '../../framework/commons.js';
import {MenuItem, MenuListContainer, TriggerButton} from './menu.style.js';
import {framework} from '../../framework/framework.js';


export const Menu = framework.component({
    name: 'Menu',
    injected: []
}, class Menu {
    destroyClickOutside = noop;
    isMenuOpen = false;

    constructor(props) {
        this.host = props.host;
        this.props = props;
    }

    getMenuList() {
        return MenuListContainer({
            ref: (ul) => this.ul = ul,
            children: map(this.props.items, (item) => MenuItem({
                children: item.name,
                onClick: (event) => this.onItemClick(item, event)
            }))
        });
    }

    onRendered(){
        if(!this.ul){
            return
        }

        this.destroyClickOutside = clickOutside(this.ul, {
            whitelist: [this.triggerButton],
            onClick: this.onToggle.bind(this)
        });

        const {height, top, left} = this.triggerButton.getBoundingClientRect();

        styleElement(this.ul, {
            left: `${left}px`,
            top: `${height + top + 2}px`,
        });
    }

    onToggle() {
        this.ul = null;
        this.destroyClickOutside();

        this.isMenuOpen = !this.isMenuOpen;

        this.forceUpdate();

        this.props.onToggle && this.props.onToggle(this.isMenuOpen);
    }

    onItemClick(item, event) {
        this.props.closeOnSelect && this.onToggle();
        this.props.onSelect && this.props.onSelect(item, event);
    }

    onDestroy() {
        this.destroyClickOutside();
        this.props.onDestroy && this.props.onDestroy();
    }

    render() {
        return [
            TriggerButton({
                children: this.props.trigger,
                onClick: this.onToggle.bind(this),
                ref: (el) => this.triggerButton = el
            }),
            this.isMenuOpen && this.getMenuList()
        ]
    }
})
