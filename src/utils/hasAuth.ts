import type {Method} from "axios";
import useUserStore from "@/stores/modules/user";


export default (operations: { permission: string; method: Method }[]) => {
    if (operations && operations.length > 0) {
        const userStore = useUserStore();
        return operations.some(({permission, method}) => {
            if (permission in userStore.permissions) {
                return userStore.permissions[permission].includes(method);
            }
            return false;
        })
    }
    return true
}