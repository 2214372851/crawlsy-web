import vPermission from "@/directives/v-permission";
import type {App} from "vue";

const directives = {permission: vPermission};

export const registerDirectives = (app: App) => {
    Object.keys(directives).forEach((key) => {
        app.directive(key, (directives as any)[key]);
    });
};
