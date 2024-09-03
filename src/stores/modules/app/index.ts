import {defineStore} from "pinia";
import {ref} from "vue";

const useAppStore = defineStore('app', () => {
    const theme = ref('system');
    const recentlyVisitedRoutes = ref<{ path: string, name: string }[]>([]);
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");

    const followOs = () => {
        if (theme.value !== 'auto') return
        if (darkThemeMq.matches) {
            document.body.setAttribute('arco-theme', 'dark')
        } else {
            document.body.removeAttribute('arco-theme');
        }
    }
    const toggleTheme = () => {
        if (theme.value === 'dark') {
            document.body.setAttribute('arco-theme', 'dark');
        } else if (theme.value === 'light') {
            theme.value = 'light';
            document.body.removeAttribute('arco-theme');
        } else {
            darkThemeMq.addEventListener('change', followOs)
        }
    };
    const addVisitedRoute = (route: { path: string; name: string }) => {
        if (['login', 'notFound'].includes(route.name) || recentlyVisitedRoutes.value.map(item => item.path).includes(route.path)) return
        recentlyVisitedRoutes.value.push(route);
        if (recentlyVisitedRoutes.value.length > 6) {
            recentlyVisitedRoutes.value.shift();
        }
    };

    return {theme, recentlyVisitedRoutes, toggleTheme, addVisitedRoute};
}, {
    persist: {
        storage: localStorage,
        paths: ['theme', 'recentlyVisitedRoutes'],
    }
});

export default useAppStore