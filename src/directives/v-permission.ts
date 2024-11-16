import type {Method} from "axios";
import type {Directive} from "vue";
import hasAuth from "@/utils/hasAuth";

const vPermission: Directive = {
    mounted(el: HTMLElement, binding: { value: { permission: string, method: Method }[] }) {
        const operations = binding.value;
        if (!hasAuth(operations)) {
            el.parentNode && el.parentNode.removeChild(el)
        }
    }
}

export default vPermission;
