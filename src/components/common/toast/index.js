import Toast from './Toats';

const plugin = {};

function removeDom(event) {
    if (event.target.parentNode) {
        event.target.parentNode.removeChild(event.target);
    }
}

plugin.install = (Vue) => {
    const ToastConstructor = Vue.extend(Toast);

    ToastConstructor.prototype.close = function() {
        this.isShow = false;
        this.$el.addEventListener('transitionend',removeDom);
    }

    Vue.prototype.$toast = (option={}) => {
		// 1.将创建出来的组件,挂载到某个div中
        const toast = new ToastConstructor();
        toast.$mount(document.createElement('div'));

		// 2.将toast的$el添加到body中
        document.bady.appendChild(toast.$el);

		// 3.获取用户自定义数据
        const duration = option.duration || 2500;
        toast.message = option.message;
        toast.isShow = true;

        setTimeout(() => {
            toast.close()
        },duration)
    }
}

export default plugin