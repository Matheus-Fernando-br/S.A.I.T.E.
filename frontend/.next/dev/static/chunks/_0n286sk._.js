(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/lucide-react/dist/esm/Icon.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Icon
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/defaultAttributes.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$hasA11yProp$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$mergeClasses$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$context$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/context.mjs [app-client] (ecmascript)");
"use strict";
"use client";
;
;
;
;
;
const Icon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ color, size, strokeWidth, absoluteStrokeWidth, className = "", children, iconNode, ...rest }, ref)=>{
    const { size: contextSize = 24, strokeWidth: contextStrokeWidth = 2, absoluteStrokeWidth: contextAbsoluteStrokeWidth = false, color: contextColor = "currentColor", className: contextClass = "" } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$context$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLucideContext"])() ?? {};
    const calculatedStrokeWidth = absoluteStrokeWidth ?? contextAbsoluteStrokeWidth ? Number(strokeWidth ?? contextStrokeWidth) * 24 / Number(size ?? contextSize) : strokeWidth ?? contextStrokeWidth;
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])("svg", {
        ref,
        ...__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"],
        width: size ?? contextSize ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].width,
        height: size ?? contextSize ?? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$defaultAttributes$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].height,
        stroke: color ?? contextColor,
        strokeWidth: calculatedStrokeWidth,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$mergeClasses$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeClasses"])("lucide", contextClass, className),
        ...!children && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$hasA11yProp$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["hasA11yProp"])(rest) && {
            "aria-hidden": "true"
        },
        ...rest
    }, [
        ...iconNode.map(([tag, attrs])=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(tag, attrs)),
        ...Array.isArray(children) ? children : [
            children
        ]
    ]);
});
;
}),
"[project]/node_modules/lucide-react/dist/esm/context.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LucideProvider",
    ()=>LucideProvider,
    "useLucideContext",
    ()=>useLucideContext
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
"use strict";
"use client";
;
const LucideContext = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({});
function LucideProvider({ children, size, color, strokeWidth, absoluteStrokeWidth, className }) {
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "LucideProvider.useMemo[value]": ()=>({
                size,
                color,
                strokeWidth,
                absoluteStrokeWidth,
                className
            })
    }["LucideProvider.useMemo[value]"], [
        size,
        color,
        strokeWidth,
        absoluteStrokeWidth,
        className
    ]);
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(LucideContext.Provider, {
        value
    }, children);
}
const useLucideContext = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(LucideContext);
;
}),
"[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>createLucideIcon
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$mergeClasses$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toKebabCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toPascalCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$Icon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/Icon.mjs [app-client] (ecmascript)");
;
;
;
;
;
const createLucideIcon = (iconName, iconNode)=>{
    const Component = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["forwardRef"])(({ className, ...props }, ref)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createElement"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$Icon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
            ref,
            iconNode,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$mergeClasses$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mergeClasses"])(`lucide-${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toKebabCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toKebabCase"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toPascalCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toPascalCase"])(iconName))}`, `lucide-${iconName}`, className),
            ...props
        }));
    Component.displayName = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toPascalCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toPascalCase"])(iconName);
    return Component;
};
;
}),
"[project]/node_modules/lucide-react/dist/esm/defaultAttributes.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>defaultAttributes
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round"
};
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/audio-lines.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>AudioLines
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M2 10v3",
            key: "1fnikh"
        }
    ],
    [
        "path",
        {
            d: "M6 6v11",
            key: "11sgs0"
        }
    ],
    [
        "path",
        {
            d: "M10 3v18",
            key: "yhl04a"
        }
    ],
    [
        "path",
        {
            d: "M14 8v7",
            key: "3a1oy3"
        }
    ],
    [
        "path",
        {
            d: "M18 5v13",
            key: "123xd1"
        }
    ],
    [
        "path",
        {
            d: "M22 10v3",
            key: "154ddg"
        }
    ]
];
const AudioLines = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("audio-lines", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/audio-lines.mjs [app-client] (ecmascript) <export default as AudioLines>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AudioLines",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$audio$2d$lines$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$audio$2d$lines$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/audio-lines.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/computer.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Computer
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "rect",
        {
            width: "14",
            height: "8",
            x: "5",
            y: "2",
            rx: "2",
            key: "wc9tft"
        }
    ],
    [
        "rect",
        {
            width: "20",
            height: "8",
            x: "2",
            y: "14",
            rx: "2",
            key: "w68u3i"
        }
    ],
    [
        "path",
        {
            d: "M6 18h2",
            key: "rwmk9e"
        }
    ],
    [
        "path",
        {
            d: "M12 18h6",
            key: "aqd8w3"
        }
    ]
];
const Computer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("computer", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/computer.mjs [app-client] (ecmascript) <export default as Computer>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Computer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$computer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$computer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/computer.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/folder-kanban.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>FolderKanban
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z",
            key: "1fr9dc"
        }
    ],
    [
        "path",
        {
            d: "M8 10v4",
            key: "tgpxqk"
        }
    ],
    [
        "path",
        {
            d: "M12 10v2",
            key: "hh53o1"
        }
    ],
    [
        "path",
        {
            d: "M16 10v6",
            key: "1d6xys"
        }
    ]
];
const FolderKanban = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("folder-kanban", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/folder-kanban.mjs [app-client] (ecmascript) <export default as FolderKanban>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "FolderKanban",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$kanban$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$kanban$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-kanban.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/graduation-cap.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>GraduationCap
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z",
            key: "j76jl0"
        }
    ],
    [
        "path",
        {
            d: "M22 10v6",
            key: "1lu8f3"
        }
    ],
    [
        "path",
        {
            d: "M6 12.5V16a6 3 0 0 0 12 0v-3.5",
            key: "1r8lef"
        }
    ]
];
const GraduationCap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("graduation-cap", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/graduation-cap.mjs [app-client] (ecmascript) <export default as GraduationCap>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GraduationCap",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/graduation-cap.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/message-square.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>MessageSquare
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z",
            key: "18887p"
        }
    ]
];
const MessageSquare = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("message-square", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/message-square.mjs [app-client] (ecmascript) <export default as MessageSquare>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MessageSquare",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/mic.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Mic
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M12 19v3",
            key: "npa21l"
        }
    ],
    [
        "path",
        {
            d: "M19 10v2a7 7 0 0 1-14 0v-2",
            key: "1vc78b"
        }
    ],
    [
        "rect",
        {
            x: "9",
            y: "2",
            width: "6",
            height: "13",
            rx: "3",
            key: "s6n7sd"
        }
    ]
];
const Mic = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("mic", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/mic.mjs [app-client] (ecmascript) <export default as Mic>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Mic",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mic.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/monitor.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Monitor
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "rect",
        {
            width: "20",
            height: "14",
            x: "2",
            y: "3",
            rx: "2",
            key: "48i651"
        }
    ],
    [
        "line",
        {
            x1: "8",
            x2: "16",
            y1: "21",
            y2: "21",
            key: "1svkeh"
        }
    ],
    [
        "line",
        {
            x1: "12",
            x2: "12",
            y1: "17",
            y2: "21",
            key: "vw1qmm"
        }
    ]
];
const Monitor = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("monitor", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/monitor.mjs [app-client] (ecmascript) <export default as Monitor>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Monitor",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/monitor.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/moon.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Moon
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",
            key: "kfwtm"
        }
    ]
];
const Moon = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("moon", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/moon.mjs [app-client] (ecmascript) <export default as Moon>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Moon",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/panel-left-close.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>PanelLeftClose
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "rect",
        {
            width: "18",
            height: "18",
            x: "3",
            y: "3",
            rx: "2",
            key: "afitv7"
        }
    ],
    [
        "path",
        {
            d: "M9 3v18",
            key: "fh3hqa"
        }
    ],
    [
        "path",
        {
            d: "m16 15-3-3 3-3",
            key: "14y99z"
        }
    ]
];
const PanelLeftClose = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("panel-left-close", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/panel-left-close.mjs [app-client] (ecmascript) <export default as PanelLeftClose>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PanelLeftClose",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$close$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$close$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/panel-left-close.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/panel-left-open.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>PanelLeftOpen
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "rect",
        {
            width: "18",
            height: "18",
            x: "3",
            y: "3",
            rx: "2",
            key: "afitv7"
        }
    ],
    [
        "path",
        {
            d: "M9 3v18",
            key: "fh3hqa"
        }
    ],
    [
        "path",
        {
            d: "m14 9 3 3-3 3",
            key: "8010ee"
        }
    ]
];
const PanelLeftOpen = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("panel-left-open", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/panel-left-open.mjs [app-client] (ecmascript) <export default as PanelLeftOpen>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PanelLeftOpen",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/panel-left-open.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Plus
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M5 12h14",
            key: "1ays0h"
        }
    ],
    [
        "path",
        {
            d: "M12 5v14",
            key: "s699le"
        }
    ]
];
const Plus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("plus", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Plus",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw-clock.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>RotateCcwClock
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",
            key: "1357e3"
        }
    ],
    [
        "path",
        {
            d: "M3 3v5h5",
            key: "1xhq8a"
        }
    ],
    [
        "path",
        {
            d: "M12 7v5l4 2",
            key: "1fdv2h"
        }
    ]
];
const RotateCcwClock = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("rotate-ccw-clock", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw-clock.mjs [app-client] (ecmascript) <export default as History>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "History",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2d$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2d$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw-clock.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Search
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "m21 21-4.34-4.34",
            key: "14j7rj"
        }
    ],
    [
        "circle",
        {
            cx: "11",
            cy: "11",
            r: "8",
            key: "4ej97u"
        }
    ]
];
const Search = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("search", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Search",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/send.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Send
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
            key: "1ffxy3"
        }
    ],
    [
        "path",
        {
            d: "m21.854 2.147-10.94 10.939",
            key: "12cjpa"
        }
    ]
];
const Send = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("send", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/send.mjs [app-client] (ecmascript) <export default as Send>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Send",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Settings
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915",
            key: "1i5ecw"
        }
    ],
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "3",
            key: "1v7zrd"
        }
    ]
];
const Settings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("settings", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-client] (ecmascript) <export default as Settings>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Settings",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/sun.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Sun
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.mjs [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "circle",
        {
            cx: "12",
            cy: "12",
            r: "4",
            key: "4exip2"
        }
    ],
    [
        "path",
        {
            d: "M12 2v2",
            key: "tus03m"
        }
    ],
    [
        "path",
        {
            d: "M12 20v2",
            key: "1lh1kg"
        }
    ],
    [
        "path",
        {
            d: "m4.93 4.93 1.41 1.41",
            key: "149t6j"
        }
    ],
    [
        "path",
        {
            d: "m17.66 17.66 1.41 1.41",
            key: "ptbguv"
        }
    ],
    [
        "path",
        {
            d: "M2 12h2",
            key: "1t8f8n"
        }
    ],
    [
        "path",
        {
            d: "M20 12h2",
            key: "1q8mjw"
        }
    ],
    [
        "path",
        {
            d: "m6.34 17.66-1.41 1.41",
            key: "1m8zz5"
        }
    ],
    [
        "path",
        {
            d: "m19.07 4.93-1.41 1.41",
            key: "1shlcs"
        }
    ]
];
const Sun = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("sun", __iconNode);
;
}),
"[project]/node_modules/lucide-react/dist/esm/icons/sun.mjs [app-client] (ecmascript) <export default as Sun>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Sun",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.mjs [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/shared/src/utils/hasA11yProp.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hasA11yProp",
    ()=>hasA11yProp
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const hasA11yProp = (props)=>{
    for(const prop in props){
        if (prop.startsWith("aria-") || prop === "role" || prop === "title") {
            return true;
        }
    }
    return false;
};
;
}),
"[project]/node_modules/lucide-react/dist/esm/shared/src/utils/mergeClasses.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "mergeClasses",
    ()=>mergeClasses
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const mergeClasses = (...classes)=>classes.filter((className, index, array)=>{
        return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
    }).join(" ").trim();
;
}),
"[project]/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "toCamelCase",
    ()=>toCamelCase
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const toCamelCase = (string)=>string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2)=>p2 ? p2.toUpperCase() : p1.toLowerCase());
;
}),
"[project]/node_modules/lucide-react/dist/esm/shared/src/utils/toKebabCase.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "toKebabCase",
    ()=>toKebabCase
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ const toKebabCase = (string)=>string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
;
}),
"[project]/node_modules/lucide-react/dist/esm/shared/src/utils/toPascalCase.mjs [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "toPascalCase",
    ()=>toPascalCase
]);
/**
 * @license lucide-react v1.32.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toCamelCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/shared/src/utils/toCamelCase.mjs [app-client] (ecmascript)");
;
const toPascalCase = (string)=>{
    const camelCase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$shared$2f$src$2f$utils$2f$toCamelCase$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["toCamelCase"])(string);
    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};
;
}),
"[project]/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Sidebar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Chat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/Chat.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function Home() {
    _s();
    const [sidebarOpen, setSidebarOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "\n        flex h-screen w-full\n        overflow-hidden\n        bg-[var(--background)]\n      ",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Sidebar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                isOpen: sidebarOpen,
                onToggle: ()=>setSidebarOpen((current)=>!current)
            }, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$Chat$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/app/page.tsx",
                lineNumber: 24,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.tsx",
        lineNumber: 12,
        columnNumber: 5
    }, this);
}
_s(Home, "fX/xBG9dqPCXDXt8dvZeCgFoxdw=");
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/AIAvatar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AIAvatar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
;
function AIAvatar({ size = "md" }) {
    const sizes = {
        sm: "h-9 w-9 text-lg",
        md: "h-16 w-16 text-2xl",
        lg: "h-24 w-24 text-4xl"
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex ${sizes[size]} items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-zinc-700 via-zinc-900 to-black shadow-xl`,
        children: "🤖"
    }, void 0, false, {
        fileName: "[project]/src/components/AIAvatar.tsx",
        lineNumber: 13,
        columnNumber: 5
    }, this);
}
_c = AIAvatar;
var _c;
__turbopack_context__.k.register(_c, "AIAvatar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Chat.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Chat
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2d$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw-clock.mjs [app-client] (ecmascript) <export default as History>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ChatInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ChatInput.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AIAvatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/AIAvatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function Chat() {
    _s();
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    async function handleSendMessage(message) {
        if (!message.trim() || isLoading) {
            return;
        }
        setError(null);
        const userMessage = {
            id: crypto.randomUUID(),
            role: "user",
            content: message
        };
        setMessages((current)=>[
                ...current,
                userMessage
            ]);
        setIsLoading(true);
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sendMessage"])(message);
            const assistantMessage = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: response
            };
            setMessages((current)=>[
                    ...current,
                    assistantMessage
                ]);
        } catch (error) {
            /* eslint-disable */ console.error(...oo_tx(`941098914_53_6_53_26_11`, error));
            setError("Não foi possível conectar ao servidor.");
        } finally{
            setIsLoading(false);
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        className: "\n        relative\n        flex h-screen min-w-0\n        flex-1 flex-col\n        bg-[var(--background)]\n        transition-colors duration-200\n      ",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "\n          absolute\n          right-6\n          top-5\n          z-20\n          flex\n          items-start\n          gap-5\n        ",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        title: "Histórico",
                        className: "\n            group\n            flex\n            min-w-[52px]\n            flex-col\n            items-center\n            justify-center\n            gap-1.5\n            bg-[var(--background)]\n            text-[var(--foreground-secondary)]\n            transition-all duration-200\n            hover:text-[var(--foreground)]\n          ",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2d$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__History$3e$__["History"], {
                                size: 19,
                                strokeWidth: 1.8,
                                className: "\n              transition-transform\n              duration-200\n              group-hover:scale-110\n            "
                            }, void 0, false, {
                                fileName: "[project]/src/components/Chat.tsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "\n              text-[10px]\n              leading-none\n            ",
                                children: "Histórico"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Chat.tsx",
                                lineNumber: 115,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Chat.tsx",
                        lineNumber: 88,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        title: "Configurações",
                        className: "\n            group\n            flex\n            min-w-[52px]\n            flex-col\n            items-center\n            justify-center\n            gap-1.5\n            bg-[var(--background)]\n            text-[var(--foreground-secondary)]\n            transition-all duration-200\n            hover:text-[var(--foreground)]\n          ",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                size: 19,
                                strokeWidth: 1.8,
                                className: "\n              transition-transform\n              duration-300\n              group-hover:rotate-45\n            "
                            }, void 0, false, {
                                fileName: "[project]/src/components/Chat.tsx",
                                lineNumber: 144,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "\n              text-[10px]\n              leading-none\n            ",
                                children: "Config."
                            }, void 0, false, {
                                fileName: "[project]/src/components/Chat.tsx",
                                lineNumber: 154,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Chat.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Chat.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "\n          flex-1\n          overflow-y-auto\n        ",
                children: messages.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "\n              flex h-full\n              flex-col\n              items-center\n              justify-center\n              px-6\n            ",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: "/assets/LOGO+TITULO+SUBTITULO BRANCO.png",
                            alt: "SAITE",
                            className: "\n                h-50\n                w-auto\n                object-contain\n              "
                        }, void 0, false, {
                            fileName: "[project]/src/components/Chat.tsx",
                            lineNumber: 187,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "\n                mt-6\n                text-3xl\n                font-semibold\n                tracking-tight\n                text-[var(--foreground)]\n              ",
                            children: "Como posso ajudar?"
                        }, void 0, false, {
                            fileName: "[project]/src/components/Chat.tsx",
                            lineNumber: 199,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "\n                mt-3\n                max-w-md\n                text-center\n                text-sm\n                leading-6\n                text-[var(--foreground-secondary)]\n              ",
                            children: "Converse comigo, pesquise informações, analise documentos ou explore seus projetos."
                        }, void 0, false, {
                            fileName: "[project]/src/components/Chat.tsx",
                            lineNumber: 213,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "\n                mt-8\n                grid\n                w-full\n                max-w-xl\n                grid-cols-2\n                gap-3\n              ",
                            children: [
                                "Analise meu currículo",
                                "Pesquise sobre IA",
                                "Me ajude a programar",
                                "Quero aprender algo"
                            ].map((suggestion)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>handleSendMessage(suggestion),
                                    disabled: isLoading,
                                    className: "\n                      rounded-xl\n                      border\n                      border-[var(--border)]\n                      bg-[var(--background-secondary)]\n                      px-4 py-3\n                      text-left\n                      text-xs\n                      text-[var(--foreground-secondary)]\n                      transition-all duration-200\n                      hover:border-[var(--border-hover)]\n                      hover:bg-[var(--background-tertiary)]\n                      hover:text-[var(--foreground)]\n                      disabled:opacity-50\n                    ",
                                    children: suggestion
                                }, suggestion, false, {
                                    fileName: "[project]/src/components/Chat.tsx",
                                    lineNumber: 245,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/Chat.tsx",
                            lineNumber: 229,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Chat.tsx",
                    lineNumber: 176,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "\n              mx-auto\n              max-w-3xl\n              space-y-6\n              px-6 py-8\n            ",
                    children: [
                        messages.map((message)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `
                    flex gap-3
                    ${message.role === "user" ? "justify-end" : "justify-start"}
                  `,
                                children: [
                                    message.role === "assistant" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AIAvatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        size: "sm"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Chat.tsx",
                                        lineNumber: 287,
                                        columnNumber: 50
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: `
                      max-w-[75%]
                      rounded-2xl
                      px-4 py-3
                      text-sm
                      leading-6
                      ${message.role === "user" ? "bg-[var(--chat-user-background)] text-[var(--chat-user-foreground)]" : "border border-[var(--border)] bg-[var(--chat-ai-background)] text-[var(--chat-ai-foreground)]"}
                    `,
                                        children: message.content
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/Chat.tsx",
                                        lineNumber: 289,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, message.id, true, {
                                fileName: "[project]/src/components/Chat.tsx",
                                lineNumber: 280,
                                columnNumber: 15
                            }, this)),
                        isLoading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "\n                  flex items-center gap-3\n                ",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AIAvatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    size: "sm"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Chat.tsx",
                                    lineNumber: 316,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "\n                    rounded-2xl\n                    border\n                    border-[var(--border)]\n                    bg-[var(--chat-ai-background)]\n                    px-4 py-3\n                  ",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "\n                      flex gap-1\n                    ",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "\n                        h-1.5 w-1.5\n                        animate-pulse\n                        rounded-full\n                        bg-[var(--foreground-muted)]\n                      "
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chat.tsx",
                                                lineNumber: 332,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "\n                        h-1.5 w-1.5\n                        animate-pulse\n                        rounded-full\n                        bg-[var(--foreground-muted)]\n                        [animation-delay:150ms]\n                      "
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chat.tsx",
                                                lineNumber: 341,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "\n                        h-1.5 w-1.5\n                        animate-pulse\n                        rounded-full\n                        bg-[var(--foreground-muted)]\n                        [animation-delay:300ms]\n                      "
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/Chat.tsx",
                                                lineNumber: 351,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/Chat.tsx",
                                        lineNumber: 327,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/components/Chat.tsx",
                                    lineNumber: 318,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/Chat.tsx",
                            lineNumber: 311,
                            columnNumber: 15
                        }, this),
                        error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "\n                  rounded-xl\n                  border\n                  border-[var(--danger)]/20\n                  bg-[var(--danger)]/5\n                  px-4 py-3\n                  text-xs\n                  text-[var(--danger)]\n                ",
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/components/Chat.tsx",
                            lineNumber: 368,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/Chat.tsx",
                    lineNumber: 271,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Chat.tsx",
                lineNumber: 169,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ChatInput$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                onSend: handleSendMessage
            }, void 0, false, {
                fileName: "[project]/src/components/Chat.tsx",
                lineNumber: 390,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Chat.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
_s(Chat, "7poOMv2jBAq/gmvoW2yS2scu15o=");
_c = Chat;
function oo_cm() {
    try {
        return (0, eval)("globalThis._console_ninja") || (0, eval)("/* https://github.com/wallabyjs/console-ninja#how-does-it-work */'use strict';var _0x1c43af=_0xa6b0;(function(_0x220cc8,_0x26af8d){var _0x2b5e22=_0xa6b0,_0x20010d=_0x220cc8();while(!![]){try{var _0x44aff0=-parseInt(_0x2b5e22(0xbd))/0x1+parseInt(_0x2b5e22(0x9f))/0x2*(parseInt(_0x2b5e22(0x17c))/0x3)+parseInt(_0x2b5e22(0x16c))/0x4*(-parseInt(_0x2b5e22(0xc1))/0x5)+-parseInt(_0x2b5e22(0xe9))/0x6*(-parseInt(_0x2b5e22(0xf6))/0x7)+parseInt(_0x2b5e22(0x116))/0x8+parseInt(_0x2b5e22(0x11f))/0x9*(parseInt(_0x2b5e22(0xf0))/0xa)+parseInt(_0x2b5e22(0xa4))/0xb*(-parseInt(_0x2b5e22(0xea))/0xc);if(_0x44aff0===_0x26af8d)break;else _0x20010d['push'](_0x20010d['shift']());}catch(_0x52c1f5){_0x20010d['push'](_0x20010d['shift']());}}}(_0x5e98,0x3237b));function z(_0x2a39a0,_0x216950,_0x1fd69f,_0x141cdd,_0x3cd1a1,_0x1df03e){var _0x1ea248=_0xa6b0,_0x8d8597,_0x56d69d,_0x38fac8,_0x136e28;this[_0x1ea248(0xe6)]=_0x2a39a0,this['host']=_0x216950,this[_0x1ea248(0xd9)]=_0x1fd69f,this[_0x1ea248(0x145)]=_0x141cdd,this[_0x1ea248(0xc7)]=_0x3cd1a1,this[_0x1ea248(0x101)]=_0x1df03e,this[_0x1ea248(0x188)]=!0x0,this[_0x1ea248(0xd4)]=!0x0,this[_0x1ea248(0x18f)]=!0x1,this[_0x1ea248(0x19f)]=!0x1,this[_0x1ea248(0xc2)]=((_0x56d69d=(_0x8d8597=_0x2a39a0[_0x1ea248(0xc5)])==null?void 0x0:_0x8d8597[_0x1ea248(0x98)])==null?void 0x0:_0x56d69d['NEXT_RUNTIME'])==='edge',this[_0x1ea248(0x13a)]=!((_0x136e28=(_0x38fac8=this['global'][_0x1ea248(0xc5)])==null?void 0x0:_0x38fac8['versions'])!=null&&_0x136e28[_0x1ea248(0x14e)])&&!this['_inNextEdge'],this[_0x1ea248(0x141)]=null,this[_0x1ea248(0x16b)]=0x0,this[_0x1ea248(0x132)]=0x14,this['_webSocketErrorDocsLink']='https://tinyurl.com/37x8b79t',this['_sendErrorMessage']=(this['_inBrowser']?_0x1ea248(0xff):_0x1ea248(0x186))+this[_0x1ea248(0x14d)];}function _0x5e98(){var _0x1d5b3b=['expo','astro','_isNegativeZero','957230rNvFvK','autoExpandPreviousObjects','getOwnPropertySymbols','_isArray','_blacklistedProperty','_hasSymbolPropertyOnItsPath','133MnKmdV','nan','_socket','edge','expId','message','hasOwnProperty','setter','timeStamp','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20refreshing\\x20the\\x20page\\x20may\\x20help;\\x20also\\x20see\\x20','_getOwnPropertyNames','eventReceivedCallback','resolveGetters','onopen','root_exp','onmessage','_isMap','date','unref','negativeInfinity','_ws','NEXT_RUNTIME','hits','length','remix','_addLoadNode','_hasMapOnItsPath','array','_numberRegExp','number','unknown','_processTreeNodeResult','3258208HkSWxa','[object\\x20Map]','_setNodeExpandableState','_p_length','bigint','toString','reload','Set','replace','27COdOne','_setNodeId','_ninjaIgnoreNextError','_setNodeLabel','slice','_treeNodePropertiesBeforeFullValue','perf_hooks','get','_objectToString','_capIfString','getOwnPropertyDescriptor','split','_isPrimitiveWrapperType','logger\\x20websocket\\x20error','object','capped','react-native','ws://','onerror','_maxConnectAttemptCount','disabledTrace','then','_reconnectTimeout','_consoleNinjaAllowedToStart','time','reduceOnCount','close','_inBrowser','_dateToString','_additionalMetadata','undefined','string','parent','_setNodePermissions','_WebSocketClass','\\x20server','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host,\\x20see\\x20','_hasSetOnItsPath','nodeModules','autoExpandPropertyCount','_property','reduceOnAccumulatedProcessingTimeMs','match','expressionsToEvaluate',[\"localhost\",\"127.0.0.1\",\"example.cypress.io\",\"10.0.2.2\",\"pc-matheus\",\"192.168.15.9\"],'_addProperty','_webSocketErrorDocsLink','node','getOwnPropertyNames','_sendErrorMessage','_attemptToReconnectShortly','_getOwnPropertySymbols','String','_propertyName','emulator','1','substr','test','console','_type','_getOwnPropertyDescriptor','function','reducePolicy','_setNodeQueryPath','\\x20browser',\"/home/matheus/.vscode-oss/extensions/wallabyjs.console-ninja-1.0.540-universal/node_modules\",'allStrLength','%c\\x20Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20','elements','return\\x20import(url.pathToFileURL(path.join(nodeModules,\\x20\\x27ws/index.js\\x27)).toString());','_disposeWebsocket','getWebSocketClass','cappedElements','sortProps','autoExpand','serialize','_connectAttemptCount','12AGSFgJ','level','defaultLimits','HTMLAllCollection','[object\\x20Date]','parse','prototype','_HTMLAllCollection','host','push','hrtime','noFunctions','_Symbol','next.js','log','1787184433464','277413nHgiME','props','some','index','forEach','trace','toLowerCase','_console_ninja_session','symbol','now','Console\\x20Ninja\\x20failed\\x20to\\x20send\\x20logs,\\x20restarting\\x20the\\x20process\\x20may\\x20help;\\x20also\\x20see\\x20','error','_allowedToSend','iterator','','resolve','bind','NEGATIVE_INFINITY','null','_connected','osName','current','logger\\x20failed\\x20to\\x20connect\\x20to\\x20host','Map','autoExpandLimit',',\\x20see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.','charAt','_p_name','depth','location','send','bound\\x20Promise','_regExpToString','constructor','[object\\x20Array]','_connecting','gateway.docker.internal','coverage','38617','_addFunctionsNode','args','resetOnProcessingTimeAverageMs','perLogpoint','env','type','_undefined','isArray','method','import(\\x27path\\x27)','Buffer','2sqiJYd','_quotedRegExp','endsWith','failed\\x20to\\x20find\\x20and\\x20load\\x20WebSocket','origin','3265273yxFbCV','_keyStrRegExp','Console\\x20Ninja\\x20extension\\x20is\\x20connected\\x20to\\x20','valueOf','stringify','resetWhenQuietMs','_setNodeExpressionPath','default','failed\\x20to\\x20connect\\x20to\\x20host:\\x20','strLength','root_exp_id','join','Promise','_WebSocket','fromCharCode','[object\\x20Set]','elapsed','warn','...','Boolean','funcName','call','10.0.2.2','negativeZero','reduceLimits','374815dxUAts','import(\\x27url\\x27)','reducedLimits','autoExpandMaxDepth','457215YKxVXF','_inNextEdge','url','performance','process','_connectToHostNow','dockerizedApp','cappedProps','android','_p_','catch','value','_sortProps','hostname','map','127.0.0.1','_isPrimitiveType','disabledLog','count','_allowedToConnectOnSend','toUpperCase','modules','angular','next.js','port','totalStrLength','onclose','_treeNodePropertiesAfterFullValue','ninjaSuppressConsole','_addObjectProperty','includes','versions','path','Symbol','_extendedWarning','_isSet','name','global','boolean','data','115188uZQjQp','12zgACNp','isExpressionToEvaluate','_console_ninja'];_0x5e98=function(){return _0x1d5b3b;};return _0x5e98();}z[_0x1c43af(0x172)][_0x1c43af(0x166)]=async function(){var _0x26cbe6=_0x1c43af,_0x463902,_0xf6e806;if(this[_0x26cbe6(0x141)])return this[_0x26cbe6(0x141)];let _0x180946;if(this[_0x26cbe6(0x13a)]||this[_0x26cbe6(0xc2)])_0x180946=this[_0x26cbe6(0xe6)]['WebSocket'];else{if((_0x463902=this[_0x26cbe6(0xe6)][_0x26cbe6(0xc5)])!=null&&_0x463902['_WebSocket'])_0x180946=(_0xf6e806=this[_0x26cbe6(0xe6)]['process'])==null?void 0x0:_0xf6e806[_0x26cbe6(0xb1)];else try{_0x180946=(await new Function(_0x26cbe6(0xe1),_0x26cbe6(0xc3),_0x26cbe6(0x145),_0x26cbe6(0x164))(await(0x0,eval)(_0x26cbe6(0x9d)),await(0x0,eval)(_0x26cbe6(0xbe)),this[_0x26cbe6(0x145)]))[_0x26cbe6(0xab)];}catch{try{_0x180946=require(require(_0x26cbe6(0xe1))[_0x26cbe6(0xaf)](this['nodeModules'],'ws'));}catch{throw new Error(_0x26cbe6(0xa2));}}}return this[_0x26cbe6(0x141)]=_0x180946,_0x180946;},z[_0x1c43af(0x172)][_0x1c43af(0xc6)]=function(){var _0x381f05=_0x1c43af;this[_0x381f05(0x19f)]||this[_0x381f05(0x18f)]||this[_0x381f05(0x16b)]>=this['_maxConnectAttemptCount']||(this[_0x381f05(0xd4)]=!0x1,this[_0x381f05(0x19f)]=!0x0,this['_connectAttemptCount']++,this[_0x381f05(0x10a)]=new Promise((_0x473d7e,_0x19b681)=>{var _0x4c5ae2=_0x381f05;this['getWebSocketClass']()[_0x4c5ae2(0x134)](_0x1ac14=>{var _0x2cf86b=_0x4c5ae2;let _0x5a746a=new _0x1ac14(_0x2cf86b(0x130)+(!this[_0x2cf86b(0x13a)]&&this[_0x2cf86b(0xc7)]?_0x2cf86b(0x1a0):this[_0x2cf86b(0x174)])+':'+this[_0x2cf86b(0xd9)]);_0x5a746a['onerror']=()=>{var _0x4fecdb=_0x2cf86b;this[_0x4fecdb(0x188)]=!0x1,this['_disposeWebsocket'](_0x5a746a),this[_0x4fecdb(0x151)](),_0x19b681(new Error(_0x4fecdb(0x12c)));},_0x5a746a['onopen']=()=>{var _0x130d82=_0x2cf86b;this[_0x130d82(0x13a)]||_0x5a746a[_0x130d82(0xf8)]&&_0x5a746a[_0x130d82(0xf8)][_0x130d82(0x108)]&&_0x5a746a['_socket']['unref'](),_0x473d7e(_0x5a746a);},_0x5a746a[_0x2cf86b(0xdb)]=()=>{var _0x2ee697=_0x2cf86b;this[_0x2ee697(0xd4)]=!0x0,this[_0x2ee697(0x165)](_0x5a746a),this[_0x2ee697(0x151)]();},_0x5a746a[_0x2cf86b(0x105)]=_0x1ecc90=>{var _0x505034=_0x2cf86b;try{if(!(_0x1ecc90!=null&&_0x1ecc90[_0x505034(0xe8)])||!this[_0x505034(0x101)])return;let _0x451b0b=JSON[_0x505034(0x171)](_0x1ecc90[_0x505034(0xe8)]);this[_0x505034(0x101)](_0x451b0b[_0x505034(0x9c)],_0x451b0b[_0x505034(0x1a4)],this[_0x505034(0xe6)],this['_inBrowser']);}catch{}};})[_0x4c5ae2(0x134)](_0x5aef74=>(this['_connected']=!0x0,this[_0x4c5ae2(0x19f)]=!0x1,this[_0x4c5ae2(0xd4)]=!0x1,this[_0x4c5ae2(0x188)]=!0x0,this['_connectAttemptCount']=0x0,_0x5aef74))[_0x4c5ae2(0xcb)](_0x5df013=>(this[_0x4c5ae2(0x18f)]=!0x1,this['_connecting']=!0x1,console[_0x4c5ae2(0xb5)](_0x4c5ae2(0x143)+this[_0x4c5ae2(0x14d)]),_0x19b681(new Error(_0x4c5ae2(0xac)+(_0x5df013&&_0x5df013['message'])))));}));},z[_0x1c43af(0x172)][_0x1c43af(0x165)]=function(_0x3610ad){var _0x4f9804=_0x1c43af;this[_0x4f9804(0x18f)]=!0x1,this[_0x4f9804(0x19f)]=!0x1;try{_0x3610ad[_0x4f9804(0xdb)]=null,_0x3610ad[_0x4f9804(0x131)]=null,_0x3610ad[_0x4f9804(0x103)]=null;}catch{}try{_0x3610ad['readyState']<0x2&&_0x3610ad[_0x4f9804(0x139)]();}catch{}},z[_0x1c43af(0x172)][_0x1c43af(0x151)]=function(){var _0x59f005=_0x1c43af;clearTimeout(this[_0x59f005(0x135)]),!(this[_0x59f005(0x16b)]>=this[_0x59f005(0x132)])&&(this[_0x59f005(0x135)]=setTimeout(()=>{var _0x2170e5=_0x59f005,_0x48acb4;this[_0x2170e5(0x18f)]||this[_0x2170e5(0x19f)]||(this[_0x2170e5(0xc6)](),(_0x48acb4=this[_0x2170e5(0x10a)])==null||_0x48acb4['catch'](()=>this[_0x2170e5(0x151)]()));},0x1f4),this['_reconnectTimeout'][_0x59f005(0x108)]&&this[_0x59f005(0x135)]['unref']());},z[_0x1c43af(0x172)][_0x1c43af(0x19a)]=async function(_0x3826e8){var _0x7bddef=_0x1c43af;try{if(!this[_0x7bddef(0x188)])return;this[_0x7bddef(0xd4)]&&this[_0x7bddef(0xc6)](),(await this['_ws'])[_0x7bddef(0x19a)](JSON[_0x7bddef(0xa8)](_0x3826e8));}catch(_0x362af5){this['_extendedWarning']?console[_0x7bddef(0xb5)](this[_0x7bddef(0x150)]+':\\x20'+(_0x362af5&&_0x362af5[_0x7bddef(0xfb)])):(this[_0x7bddef(0xe3)]=!0x0,console['warn'](this[_0x7bddef(0x150)]+':\\x20'+(_0x362af5&&_0x362af5[_0x7bddef(0xfb)]),_0x3826e8)),this[_0x7bddef(0x188)]=!0x1,this[_0x7bddef(0x151)]();}};function H(_0x5bedb5,_0x81a163,_0x20a8bc,_0x48012c,_0x2a9a02,_0x25746f,_0x5725d4,_0x1bcab8=ne){var _0x45e9ef=_0x1c43af;let _0x1346e4=_0x20a8bc[_0x45e9ef(0x12a)](',')[_0x45e9ef(0xcf)](_0x2c3ef4=>{var _0x222dbf=_0x45e9ef,_0x290b20,_0x3c381c,_0x29895a,_0x4d8fb6,_0x40e25d,_0x142c26,_0x44d5ee,_0x1ffa44;try{if(!_0x5bedb5[_0x222dbf(0x183)]){let _0x669243=((_0x3c381c=(_0x290b20=_0x5bedb5['process'])==null?void 0x0:_0x290b20[_0x222dbf(0xe0)])==null?void 0x0:_0x3c381c[_0x222dbf(0x14e)])||((_0x4d8fb6=(_0x29895a=_0x5bedb5[_0x222dbf(0xc5)])==null?void 0x0:_0x29895a[_0x222dbf(0x98)])==null?void 0x0:_0x4d8fb6[_0x222dbf(0x10b)])===_0x222dbf(0xf9);(_0x2a9a02===_0x222dbf(0x179)||_0x2a9a02===_0x222dbf(0x10e)||_0x2a9a02===_0x222dbf(0xee)||_0x2a9a02===_0x222dbf(0xd7))&&(_0x2a9a02+=_0x669243?_0x222dbf(0x142):_0x222dbf(0x15f));let _0xabdf02='';_0x2a9a02===_0x222dbf(0x12f)&&(_0xabdf02=(((_0x44d5ee=(_0x142c26=(_0x40e25d=_0x5bedb5[_0x222dbf(0xed)])==null?void 0x0:_0x40e25d[_0x222dbf(0xd6)])==null?void 0x0:_0x142c26['ExpoDevice'])==null?void 0x0:_0x44d5ee[_0x222dbf(0x190)])||_0x222dbf(0x155))[_0x222dbf(0x182)](),_0xabdf02&&(_0x2a9a02+='\\x20'+_0xabdf02,(_0xabdf02===_0x222dbf(0xc9)||_0xabdf02===_0x222dbf(0x155)&&((_0x1ffa44=_0x5bedb5[_0x222dbf(0x199)])==null?void 0x0:_0x1ffa44[_0x222dbf(0xce)])===_0x222dbf(0xba))&&(_0x81a163='10.0.2.2'))),_0x5bedb5[_0x222dbf(0x183)]={'id':+new Date(),'tool':_0x2a9a02},_0x5725d4&&_0x2a9a02&&!_0x669243&&(_0xabdf02?console['log'](_0x222dbf(0xa6)+_0xabdf02+_0x222dbf(0x195)):console[_0x222dbf(0x17a)](_0x222dbf(0x162)+(_0x2a9a02[_0x222dbf(0x196)](0x0)[_0x222dbf(0xd5)]()+_0x2a9a02[_0x222dbf(0x157)](0x1))+',','background:\\x20rgb(30,30,30);\\x20color:\\x20rgb(255,213,92)','see\\x20https://tinyurl.com/2vt8jxzw\\x20for\\x20more\\x20info.'));}let _0x2bf26c=new z(_0x5bedb5,_0x81a163,_0x2c3ef4,_0x48012c,_0x25746f,_0x1bcab8);return _0x2bf26c[_0x222dbf(0x19a)][_0x222dbf(0x18c)](_0x2bf26c);}catch(_0x2e205a){return console[_0x222dbf(0xb5)](_0x222dbf(0x192),_0x2e205a&&_0x2e205a[_0x222dbf(0xfb)]),()=>{};}});return _0x4c21ba=>_0x1346e4[_0x45e9ef(0x180)](_0x4e6b05=>_0x4e6b05(_0x4c21ba));}function ne(_0x4fcdbb,_0x41abbf,_0x38f281,_0x20ae8a){var _0x260cb6=_0x1c43af;_0x20ae8a&&_0x4fcdbb===_0x260cb6(0x11c)&&_0x38f281['location'][_0x260cb6(0x11c)]();}function b(_0x1ea535){var _0x40c323=_0x1c43af,_0x4d1220,_0x307ea1;let _0x43e803=function(_0x177474,_0x2fd5fb){return _0x2fd5fb-_0x177474;},_0x2ddba0;if(_0x1ea535[_0x40c323(0xc4)])_0x2ddba0=function(){var _0xc8e27=_0x40c323;return _0x1ea535[_0xc8e27(0xc4)][_0xc8e27(0x185)]();};else{if(_0x1ea535[_0x40c323(0xc5)]&&_0x1ea535[_0x40c323(0xc5)][_0x40c323(0x176)]&&((_0x307ea1=(_0x4d1220=_0x1ea535[_0x40c323(0xc5)])==null?void 0x0:_0x4d1220['env'])==null?void 0x0:_0x307ea1[_0x40c323(0x10b)])!==_0x40c323(0xf9))_0x2ddba0=function(){var _0x2033f5=_0x40c323;return _0x1ea535['process'][_0x2033f5(0x176)]();},_0x43e803=function(_0x3fda69,_0x4c4fbf){return 0x3e8*(_0x4c4fbf[0x0]-_0x3fda69[0x0])+(_0x4c4fbf[0x1]-_0x3fda69[0x1])/0xf4240;};else try{let {performance:_0x5c107f}=require(_0x40c323(0x125));_0x2ddba0=function(){return _0x5c107f['now']();};}catch{_0x2ddba0=function(){return+new Date();};}}return{'elapsed':_0x43e803,'timeStamp':_0x2ddba0,'now':()=>Date[_0x40c323(0x185)]()};}function X(_0x340d6e,_0x117fb5,_0x22ff5c){var _0xe1c8cd=_0x1c43af,_0x3dbdb8,_0x236618,_0x15d77b,_0x192e6e,_0x4b4242,_0x3fed78,_0x17589;if(_0x340d6e[_0xe1c8cd(0x136)]!==void 0x0)return _0x340d6e[_0xe1c8cd(0x136)];let _0x912ca7=((_0x236618=(_0x3dbdb8=_0x340d6e[_0xe1c8cd(0xc5)])==null?void 0x0:_0x3dbdb8[_0xe1c8cd(0xe0)])==null?void 0x0:_0x236618['node'])||((_0x192e6e=(_0x15d77b=_0x340d6e['process'])==null?void 0x0:_0x15d77b[_0xe1c8cd(0x98)])==null?void 0x0:_0x192e6e[_0xe1c8cd(0x10b)])==='edge',_0x6b35ca=!!(_0x22ff5c===_0xe1c8cd(0x12f)&&((_0x4b4242=_0x340d6e[_0xe1c8cd(0xed)])==null?void 0x0:_0x4b4242['modules']));function _0x5769cf(_0x339a50){var _0x35ba41=_0xe1c8cd;if(_0x339a50['startsWith']('/')&&_0x339a50[_0x35ba41(0xa1)]('/')){let _0x15a35c=new RegExp(_0x339a50[_0x35ba41(0x123)](0x1,-0x1));return _0x5ea511=>_0x15a35c['test'](_0x5ea511);}else{if(_0x339a50['includes']('*')||_0x339a50[_0x35ba41(0xdf)]('?')){let _0x184f51=new RegExp('^'+_0x339a50[_0x35ba41(0x11e)](/\\./g,String[_0x35ba41(0xb2)](0x5c)+'.')[_0x35ba41(0x11e)](/\\*/g,'.*')['replace'](/\\?/g,'.')+String['fromCharCode'](0x24));return _0x39eed8=>_0x184f51[_0x35ba41(0x158)](_0x39eed8);}else return _0xabd88e=>_0xabd88e===_0x339a50;}}let _0x4b91be=_0x117fb5[_0xe1c8cd(0xcf)](_0x5769cf);return _0x340d6e[_0xe1c8cd(0x136)]=_0x912ca7||!_0x117fb5,!_0x340d6e[_0xe1c8cd(0x136)]&&((_0x3fed78=_0x340d6e['location'])==null?void 0x0:_0x3fed78['hostname'])&&(_0x340d6e[_0xe1c8cd(0x136)]=_0x4b91be[_0xe1c8cd(0x17e)](_0x343231=>_0x343231(_0x340d6e[_0xe1c8cd(0x199)][_0xe1c8cd(0xce)]))),_0x6b35ca&&!_0x340d6e[_0xe1c8cd(0x136)]&&!((_0x17589=_0x340d6e['location'])!=null&&_0x17589['hostname'])&&(_0x340d6e[_0xe1c8cd(0x136)]=!0x0),_0x340d6e['_consoleNinjaAllowedToStart'];}function _0xa6b0(_0x3977d5,_0x32be94){var _0x5e983e=_0x5e98();return _0xa6b0=function(_0xa6b054,_0x27ece8){_0xa6b054=_0xa6b054-0x97;var _0x18222c=_0x5e983e[_0xa6b054];return _0x18222c;},_0xa6b0(_0x3977d5,_0x32be94);}function J(_0x2a19ae,_0x447b71,_0x7f88c9,_0x5161a5,_0x483b0f,_0x599cd8){var _0x1bff5a=_0x1c43af;_0x2a19ae=_0x2a19ae,_0x447b71=_0x447b71,_0x7f88c9=_0x7f88c9,_0x5161a5=_0x5161a5,_0x483b0f=_0x483b0f,_0x483b0f=_0x483b0f||{},_0x483b0f[_0x1bff5a(0x16e)]=_0x483b0f[_0x1bff5a(0x16e)]||{},_0x483b0f['reducedLimits']=_0x483b0f[_0x1bff5a(0xbf)]||{},_0x483b0f[_0x1bff5a(0x15d)]=_0x483b0f[_0x1bff5a(0x15d)]||{},_0x483b0f[_0x1bff5a(0x15d)]['perLogpoint']=_0x483b0f['reducePolicy'][_0x1bff5a(0x97)]||{},_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)]=_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)]||{};let _0x15035d={'perLogpoint':{'reduceOnCount':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0x97)][_0x1bff5a(0x138)]||0x32,'reduceOnAccumulatedProcessingTimeMs':_0x483b0f[_0x1bff5a(0x15d)]['perLogpoint'][_0x1bff5a(0x148)]||0x64,'resetWhenQuietMs':_0x483b0f[_0x1bff5a(0x15d)]['perLogpoint']['resetWhenQuietMs']||0x1f4,'resetOnProcessingTimeAverageMs':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0x97)]['resetOnProcessingTimeAverageMs']||0x64},'global':{'reduceOnCount':_0x483b0f[_0x1bff5a(0x15d)]['global'][_0x1bff5a(0x138)]||0x3e8,'reduceOnAccumulatedProcessingTimeMs':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)]['reduceOnAccumulatedProcessingTimeMs']||0x12c,'resetWhenQuietMs':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)]['resetWhenQuietMs']||0x32,'resetOnProcessingTimeAverageMs':_0x483b0f[_0x1bff5a(0x15d)][_0x1bff5a(0xe6)][_0x1bff5a(0x1a5)]||0x64}},_0x501118=b(_0x2a19ae),_0x49b596=_0x501118[_0x1bff5a(0xb4)],_0x32f0dd=_0x501118['timeStamp'];function _0x3c842b(){var _0x32cdb1=_0x1bff5a;this[_0x32cdb1(0xa5)]=/^(?!(?:do|if|in|for|let|new|try|var|case|else|enum|eval|false|null|this|true|void|with|break|catch|class|const|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$)[_$a-zA-Z\\xA0-\\uFFFF][_$a-zA-Z0-9\\xA0-\\uFFFF]*$/,this[_0x32cdb1(0x112)]=/^(0|[1-9][0-9]*)$/,this[_0x32cdb1(0xa0)]=/'([^\\\\']|\\\\')*'/,this[_0x32cdb1(0x9a)]=_0x2a19ae[_0x32cdb1(0x13d)],this[_0x32cdb1(0x173)]=_0x2a19ae['HTMLAllCollection'],this[_0x32cdb1(0x15b)]=Object[_0x32cdb1(0x129)],this['_getOwnPropertyNames']=Object[_0x32cdb1(0x14f)],this['_Symbol']=_0x2a19ae[_0x32cdb1(0xe2)],this[_0x32cdb1(0x19c)]=RegExp[_0x32cdb1(0x172)]['toString'],this[_0x32cdb1(0x13b)]=Date[_0x32cdb1(0x172)][_0x32cdb1(0x11b)];}_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x16a)]=function(_0x40d313,_0x3fb199,_0x10e703,_0x3e651e){var _0x31c197=_0x1bff5a,_0x5c7575=this,_0xb95b67=_0x10e703[_0x31c197(0x169)];function _0x7ee627(_0x50c25b,_0x2d57c1,_0x4ad281){var _0x32ec39=_0x31c197;_0x2d57c1[_0x32ec39(0x99)]=_0x32ec39(0x114),_0x2d57c1[_0x32ec39(0x187)]=_0x50c25b[_0x32ec39(0xfb)],_0x16f50a=_0x4ad281[_0x32ec39(0x14e)][_0x32ec39(0x191)],_0x4ad281['node'][_0x32ec39(0x191)]=_0x2d57c1,_0x5c7575[_0x32ec39(0x124)](_0x2d57c1,_0x4ad281);}let _0x36cd62,_0x1773b6,_0x23751c=_0x2a19ae[_0x31c197(0xdd)];_0x2a19ae['ninjaSuppressConsole']=!0x0,_0x2a19ae[_0x31c197(0x159)]&&(_0x36cd62=_0x2a19ae[_0x31c197(0x159)][_0x31c197(0x187)],_0x1773b6=_0x2a19ae['console'][_0x31c197(0xb5)],_0x36cd62&&(_0x2a19ae[_0x31c197(0x159)][_0x31c197(0x187)]=function(){}),_0x1773b6&&(_0x2a19ae[_0x31c197(0x159)][_0x31c197(0xb5)]=function(){}));try{try{_0x10e703[_0x31c197(0x16d)]++,_0x10e703[_0x31c197(0x169)]&&_0x10e703[_0x31c197(0xf1)]['push'](_0x3fb199);var _0x25e0f3,_0x4eb4e8,_0x18d4fe,_0x37ccc9,_0x30d81d=[],_0x56445b=[],_0x302c18,_0x5830a7=this[_0x31c197(0x15a)](_0x3fb199),_0x2a7b73=_0x5830a7===_0x31c197(0x111),_0x8efbaa=!0x1,_0x5670c1=_0x5830a7===_0x31c197(0x15c),_0x2c17b4=this['_isPrimitiveType'](_0x5830a7),_0xb70796=this['_isPrimitiveWrapperType'](_0x5830a7),_0x3c20b2=_0x2c17b4||_0xb70796,_0x36f42e={},_0x552b6b=0x0,_0x22e716=!0x1,_0x16f50a,_0x1394aa=/^(([1-9]{1}[0-9]*)|0)$/;if(_0x10e703[_0x31c197(0x198)]){if(_0x2a7b73){if(_0x4eb4e8=_0x3fb199[_0x31c197(0x10d)],_0x4eb4e8>_0x10e703[_0x31c197(0x163)]){for(_0x18d4fe=0x0,_0x37ccc9=_0x10e703[_0x31c197(0x163)],_0x25e0f3=_0x18d4fe;_0x25e0f3<_0x37ccc9;_0x25e0f3++)_0x56445b[_0x31c197(0x175)](_0x5c7575[_0x31c197(0x14c)](_0x30d81d,_0x3fb199,_0x5830a7,_0x25e0f3,_0x10e703));_0x40d313[_0x31c197(0x167)]=!0x0;}else{for(_0x18d4fe=0x0,_0x37ccc9=_0x4eb4e8,_0x25e0f3=_0x18d4fe;_0x25e0f3<_0x37ccc9;_0x25e0f3++)_0x56445b[_0x31c197(0x175)](_0x5c7575[_0x31c197(0x14c)](_0x30d81d,_0x3fb199,_0x5830a7,_0x25e0f3,_0x10e703));}_0x10e703[_0x31c197(0x146)]+=_0x56445b[_0x31c197(0x10d)];}if(!(_0x5830a7==='null'||_0x5830a7==='undefined')&&!_0x2c17b4&&_0x5830a7!==_0x31c197(0x153)&&_0x5830a7!==_0x31c197(0x9e)&&_0x5830a7!==_0x31c197(0x11a)){var _0x718615=_0x3e651e[_0x31c197(0x17d)]||_0x10e703[_0x31c197(0x17d)];if(this[_0x31c197(0xe4)](_0x3fb199)?(_0x25e0f3=0x0,_0x3fb199[_0x31c197(0x180)](function(_0x5367ff){var _0x157c73=_0x31c197;if(_0x552b6b++,_0x10e703[_0x157c73(0x146)]++,_0x552b6b>_0x718615){_0x22e716=!0x0;return;}if(!_0x10e703[_0x157c73(0xeb)]&&_0x10e703[_0x157c73(0x169)]&&_0x10e703[_0x157c73(0x146)]>_0x10e703['autoExpandLimit']){_0x22e716=!0x0;return;}_0x56445b[_0x157c73(0x175)](_0x5c7575['_addProperty'](_0x30d81d,_0x3fb199,_0x157c73(0x11d),_0x25e0f3++,_0x10e703,function(_0x4b87c0){return function(){return _0x4b87c0;};}(_0x5367ff)));})):this['_isMap'](_0x3fb199)&&_0x3fb199['forEach'](function(_0x4f6586,_0x1127ce){var _0x1f1731=_0x31c197;if(_0x552b6b++,_0x10e703[_0x1f1731(0x146)]++,_0x552b6b>_0x718615){_0x22e716=!0x0;return;}if(!_0x10e703['isExpressionToEvaluate']&&_0x10e703[_0x1f1731(0x169)]&&_0x10e703[_0x1f1731(0x146)]>_0x10e703['autoExpandLimit']){_0x22e716=!0x0;return;}var _0x5c22c1=_0x1127ce[_0x1f1731(0x11b)]();_0x5c22c1[_0x1f1731(0x10d)]>0x64&&(_0x5c22c1=_0x5c22c1[_0x1f1731(0x123)](0x0,0x64)+_0x1f1731(0xb6)),_0x56445b[_0x1f1731(0x175)](_0x5c7575[_0x1f1731(0x14c)](_0x30d81d,_0x3fb199,'Map',_0x5c22c1,_0x10e703,function(_0x310ba3){return function(){return _0x310ba3;};}(_0x4f6586)));}),!_0x8efbaa){try{for(_0x302c18 in _0x3fb199)if(!(_0x2a7b73&&_0x1394aa[_0x31c197(0x158)](_0x302c18))&&!this[_0x31c197(0xf4)](_0x3fb199,_0x302c18,_0x10e703)){if(_0x552b6b++,_0x10e703[_0x31c197(0x146)]++,_0x552b6b>_0x718615){_0x22e716=!0x0;break;}if(!_0x10e703[_0x31c197(0xeb)]&&_0x10e703['autoExpand']&&_0x10e703[_0x31c197(0x146)]>_0x10e703[_0x31c197(0x194)]){_0x22e716=!0x0;break;}_0x56445b['push'](_0x5c7575['_addObjectProperty'](_0x30d81d,_0x36f42e,_0x3fb199,_0x5830a7,_0x302c18,_0x10e703));}}catch{}if(_0x36f42e[_0x31c197(0x119)]=!0x0,_0x5670c1&&(_0x36f42e[_0x31c197(0x197)]=!0x0),!_0x22e716){var _0xf18844=[]['concat'](this[_0x31c197(0x100)](_0x3fb199))['concat'](this[_0x31c197(0x152)](_0x3fb199));for(_0x25e0f3=0x0,_0x4eb4e8=_0xf18844[_0x31c197(0x10d)];_0x25e0f3<_0x4eb4e8;_0x25e0f3++)if(_0x302c18=_0xf18844[_0x25e0f3],!(_0x2a7b73&&_0x1394aa[_0x31c197(0x158)](_0x302c18['toString']()))&&!this[_0x31c197(0xf4)](_0x3fb199,_0x302c18,_0x10e703)&&!_0x36f42e[typeof _0x302c18!=_0x31c197(0x184)?_0x31c197(0xca)+_0x302c18[_0x31c197(0x11b)]():_0x302c18]){if(_0x552b6b++,_0x10e703[_0x31c197(0x146)]++,_0x552b6b>_0x718615){_0x22e716=!0x0;break;}if(!_0x10e703[_0x31c197(0xeb)]&&_0x10e703['autoExpand']&&_0x10e703[_0x31c197(0x146)]>_0x10e703['autoExpandLimit']){_0x22e716=!0x0;break;}_0x56445b['push'](_0x5c7575[_0x31c197(0xde)](_0x30d81d,_0x36f42e,_0x3fb199,_0x5830a7,_0x302c18,_0x10e703));}}}}}if(_0x40d313[_0x31c197(0x99)]=_0x5830a7,_0x3c20b2?(_0x40d313['value']=_0x3fb199[_0x31c197(0xa7)](),this[_0x31c197(0x128)](_0x5830a7,_0x40d313,_0x10e703,_0x3e651e)):_0x5830a7===_0x31c197(0x107)?_0x40d313[_0x31c197(0xcc)]=this['_dateToString'][_0x31c197(0xb9)](_0x3fb199):_0x5830a7===_0x31c197(0x11a)?_0x40d313[_0x31c197(0xcc)]=_0x3fb199[_0x31c197(0x11b)]():_0x5830a7==='RegExp'?_0x40d313['value']=this[_0x31c197(0x19c)][_0x31c197(0xb9)](_0x3fb199):_0x5830a7===_0x31c197(0x184)&&this[_0x31c197(0x178)]?_0x40d313[_0x31c197(0xcc)]=this[_0x31c197(0x178)][_0x31c197(0x172)][_0x31c197(0x11b)]['call'](_0x3fb199):!_0x10e703[_0x31c197(0x198)]&&!(_0x5830a7===_0x31c197(0x18e)||_0x5830a7===_0x31c197(0x13d))&&(delete _0x40d313[_0x31c197(0xcc)],_0x40d313['capped']=!0x0),_0x22e716&&(_0x40d313[_0x31c197(0xc8)]=!0x0),_0x16f50a=_0x10e703[_0x31c197(0x14e)]['current'],_0x10e703[_0x31c197(0x14e)][_0x31c197(0x191)]=_0x40d313,this['_treeNodePropertiesBeforeFullValue'](_0x40d313,_0x10e703),_0x56445b['length']){for(_0x25e0f3=0x0,_0x4eb4e8=_0x56445b[_0x31c197(0x10d)];_0x25e0f3<_0x4eb4e8;_0x25e0f3++)_0x56445b[_0x25e0f3](_0x25e0f3);}_0x30d81d[_0x31c197(0x10d)]&&(_0x40d313['props']=_0x30d81d);}catch(_0x48a3c4){_0x7ee627(_0x48a3c4,_0x40d313,_0x10e703);}this['_additionalMetadata'](_0x3fb199,_0x40d313),this[_0x31c197(0xdc)](_0x40d313,_0x10e703),_0x10e703[_0x31c197(0x14e)]['current']=_0x16f50a,_0x10e703[_0x31c197(0x16d)]--,_0x10e703[_0x31c197(0x169)]=_0xb95b67,_0x10e703[_0x31c197(0x169)]&&_0x10e703['autoExpandPreviousObjects']['pop']();}finally{_0x36cd62&&(_0x2a19ae[_0x31c197(0x159)][_0x31c197(0x187)]=_0x36cd62),_0x1773b6&&(_0x2a19ae['console']['warn']=_0x1773b6),_0x2a19ae[_0x31c197(0xdd)]=_0x23751c;}return _0x40d313;},_0x3c842b['prototype'][_0x1bff5a(0x152)]=function(_0x5568c0){var _0x950ed8=_0x1bff5a;return Object[_0x950ed8(0xf2)]?Object[_0x950ed8(0xf2)](_0x5568c0):[];},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xe4)]=function(_0x5cff31){var _0x5294c9=_0x1bff5a;return!!(_0x5cff31&&_0x2a19ae[_0x5294c9(0x11d)]&&this['_objectToString'](_0x5cff31)===_0x5294c9(0xb3)&&_0x5cff31[_0x5294c9(0x180)]);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xf4)]=function(_0x176394,_0x32608a,_0xd5d805){var _0x4c84a9=_0x1bff5a;if(!_0xd5d805['resolveGetters']){let _0x75bbab=this['_getOwnPropertyDescriptor'](_0x176394,_0x32608a);if(_0x75bbab&&_0x75bbab[_0x4c84a9(0x126)])return!0x0;}return _0xd5d805[_0x4c84a9(0x177)]?typeof _0x176394[_0x32608a]=='function':!0x1;},_0x3c842b['prototype'][_0x1bff5a(0x15a)]=function(_0x2dedf1){var _0x14c6b0=_0x1bff5a,_0x5f049e='';return _0x5f049e=typeof _0x2dedf1,_0x5f049e===_0x14c6b0(0x12d)?this[_0x14c6b0(0x127)](_0x2dedf1)===_0x14c6b0(0x19e)?_0x5f049e=_0x14c6b0(0x111):this[_0x14c6b0(0x127)](_0x2dedf1)===_0x14c6b0(0x170)?_0x5f049e=_0x14c6b0(0x107):this[_0x14c6b0(0x127)](_0x2dedf1)==='[object\\x20BigInt]'?_0x5f049e=_0x14c6b0(0x11a):_0x2dedf1===null?_0x5f049e=_0x14c6b0(0x18e):_0x2dedf1[_0x14c6b0(0x19d)]&&(_0x5f049e=_0x2dedf1[_0x14c6b0(0x19d)][_0x14c6b0(0xe5)]||_0x5f049e):_0x5f049e===_0x14c6b0(0x13d)&&this[_0x14c6b0(0x173)]&&_0x2dedf1 instanceof this[_0x14c6b0(0x173)]&&(_0x5f049e=_0x14c6b0(0x16f)),_0x5f049e;},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x127)]=function(_0x26fd83){var _0x2cc9cb=_0x1bff5a;return Object[_0x2cc9cb(0x172)][_0x2cc9cb(0x11b)][_0x2cc9cb(0xb9)](_0x26fd83);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xd1)]=function(_0x33c047){var _0x1aed3d=_0x1bff5a;return _0x33c047===_0x1aed3d(0xe7)||_0x33c047===_0x1aed3d(0x13e)||_0x33c047===_0x1aed3d(0x113);},_0x3c842b['prototype'][_0x1bff5a(0x12b)]=function(_0x9c26bc){var _0x3445a7=_0x1bff5a;return _0x9c26bc===_0x3445a7(0xb7)||_0x9c26bc===_0x3445a7(0x153)||_0x9c26bc==='Number';},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x14c)]=function(_0x39d72b,_0x222394,_0x39ca3a,_0x3315a9,_0x2af968,_0x5ca931){var _0x13303e=this;return function(_0x3b0a04){var _0xfd957=_0xa6b0,_0x1e9977=_0x2af968['node']['current'],_0x416967=_0x2af968['node']['index'],_0x278cad=_0x2af968[_0xfd957(0x14e)][_0xfd957(0x13f)];_0x2af968['node']['parent']=_0x1e9977,_0x2af968[_0xfd957(0x14e)][_0xfd957(0x17f)]=typeof _0x3315a9==_0xfd957(0x113)?_0x3315a9:_0x3b0a04,_0x39d72b[_0xfd957(0x175)](_0x13303e[_0xfd957(0x147)](_0x222394,_0x39ca3a,_0x3315a9,_0x2af968,_0x5ca931)),_0x2af968[_0xfd957(0x14e)]['parent']=_0x278cad,_0x2af968[_0xfd957(0x14e)][_0xfd957(0x17f)]=_0x416967;};},_0x3c842b['prototype'][_0x1bff5a(0xde)]=function(_0x1ac5b3,_0x4e5a09,_0x41a166,_0x5aef46,_0x28ffe1,_0xa4d180,_0xaf189c){var _0x416fff=_0x1bff5a,_0x5079ab=this;return _0x4e5a09[typeof _0x28ffe1!=_0x416fff(0x184)?_0x416fff(0xca)+_0x28ffe1[_0x416fff(0x11b)]():_0x28ffe1]=!0x0,function(_0x193c6b){var _0x8b0c8=_0x416fff,_0x4e890c=_0xa4d180[_0x8b0c8(0x14e)][_0x8b0c8(0x191)],_0x1de07b=_0xa4d180[_0x8b0c8(0x14e)]['index'],_0x4c6e05=_0xa4d180[_0x8b0c8(0x14e)][_0x8b0c8(0x13f)];_0xa4d180[_0x8b0c8(0x14e)][_0x8b0c8(0x13f)]=_0x4e890c,_0xa4d180['node']['index']=_0x193c6b,_0x1ac5b3['push'](_0x5079ab['_property'](_0x41a166,_0x5aef46,_0x28ffe1,_0xa4d180,_0xaf189c)),_0xa4d180['node']['parent']=_0x4c6e05,_0xa4d180[_0x8b0c8(0x14e)][_0x8b0c8(0x17f)]=_0x1de07b;};},_0x3c842b['prototype'][_0x1bff5a(0x147)]=function(_0x3fc911,_0x53af0b,_0x1daee9,_0x1aaecf,_0x3c6648){var _0x24ab9f=_0x1bff5a,_0x1044ef=this;_0x3c6648||(_0x3c6648=function(_0x5aebf0,_0xe2bf62){return _0x5aebf0[_0xe2bf62];});var _0x3ba706=_0x1daee9[_0x24ab9f(0x11b)](),_0x147ad8=_0x1aaecf[_0x24ab9f(0x14a)]||{},_0x564175=_0x1aaecf[_0x24ab9f(0x198)],_0x4c8e20=_0x1aaecf['isExpressionToEvaluate'];try{var _0xa14fb7=this[_0x24ab9f(0x106)](_0x3fc911),_0xf1a445=_0x3ba706;_0xa14fb7&&_0xf1a445[0x0]==='\\x27'&&(_0xf1a445=_0xf1a445[_0x24ab9f(0x157)](0x1,_0xf1a445[_0x24ab9f(0x10d)]-0x2));var _0x83dd31=_0x1aaecf[_0x24ab9f(0x14a)]=_0x147ad8[_0x24ab9f(0xca)+_0xf1a445];_0x83dd31&&(_0x1aaecf[_0x24ab9f(0x198)]=_0x1aaecf[_0x24ab9f(0x198)]+0x1),_0x1aaecf['isExpressionToEvaluate']=!!_0x83dd31;var _0x1718af=typeof _0x1daee9==_0x24ab9f(0x184),_0x3e3cf6={'name':_0x1718af||_0xa14fb7?_0x3ba706:this[_0x24ab9f(0x154)](_0x3ba706)};if(_0x1718af&&(_0x3e3cf6[_0x24ab9f(0x184)]=!0x0),!(_0x53af0b===_0x24ab9f(0x111)||_0x53af0b==='Error')){var _0x270121=this[_0x24ab9f(0x15b)](_0x3fc911,_0x1daee9);if(_0x270121&&(_0x270121['set']&&(_0x3e3cf6[_0x24ab9f(0xfd)]=!0x0),_0x270121['get']&&!_0x83dd31&&!_0x1aaecf[_0x24ab9f(0x102)]))return _0x3e3cf6['getter']=!0x0,this['_processTreeNodeResult'](_0x3e3cf6,_0x1aaecf),_0x3e3cf6;}var _0x75d602;try{_0x75d602=_0x3c6648(_0x3fc911,_0x1daee9);}catch(_0x13aa60){return _0x3e3cf6={'name':_0x3ba706,'type':_0x24ab9f(0x114),'error':_0x13aa60[_0x24ab9f(0xfb)]},this['_processTreeNodeResult'](_0x3e3cf6,_0x1aaecf),_0x3e3cf6;}var _0x74802c=this['_type'](_0x75d602),_0x3e9d1f=this['_isPrimitiveType'](_0x74802c);if(_0x3e3cf6[_0x24ab9f(0x99)]=_0x74802c,_0x3e9d1f)this[_0x24ab9f(0x115)](_0x3e3cf6,_0x1aaecf,_0x75d602,function(){var _0x58307e=_0x24ab9f;_0x3e3cf6[_0x58307e(0xcc)]=_0x75d602['valueOf'](),!_0x83dd31&&_0x1044ef[_0x58307e(0x128)](_0x74802c,_0x3e3cf6,_0x1aaecf,{});});else{var _0xf56525=_0x1aaecf['autoExpand']&&_0x1aaecf[_0x24ab9f(0x16d)]<_0x1aaecf[_0x24ab9f(0xc0)]&&_0x1aaecf['autoExpandPreviousObjects']['indexOf'](_0x75d602)<0x0&&_0x74802c!==_0x24ab9f(0x15c)&&_0x1aaecf[_0x24ab9f(0x146)]<_0x1aaecf['autoExpandLimit'];_0xf56525||_0x1aaecf['level']<_0x564175||_0x83dd31?this[_0x24ab9f(0x16a)](_0x3e3cf6,_0x75d602,_0x1aaecf,_0x83dd31||{}):this[_0x24ab9f(0x115)](_0x3e3cf6,_0x1aaecf,_0x75d602,function(){var _0x393a95=_0x24ab9f;_0x74802c===_0x393a95(0x18e)||_0x74802c===_0x393a95(0x13d)||(delete _0x3e3cf6[_0x393a95(0xcc)],_0x3e3cf6[_0x393a95(0x12e)]=!0x0);});}return _0x3e3cf6;}finally{_0x1aaecf[_0x24ab9f(0x14a)]=_0x147ad8,_0x1aaecf['depth']=_0x564175,_0x1aaecf[_0x24ab9f(0xeb)]=_0x4c8e20;}},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x128)]=function(_0x56d3fe,_0x3888bc,_0x5eecce,_0x4702b6){var _0x2683b4=_0x1bff5a,_0x25341f=_0x4702b6[_0x2683b4(0xad)]||_0x5eecce[_0x2683b4(0xad)];if((_0x56d3fe==='string'||_0x56d3fe===_0x2683b4(0x153))&&_0x3888bc[_0x2683b4(0xcc)]){let _0x49128b=_0x3888bc[_0x2683b4(0xcc)][_0x2683b4(0x10d)];_0x5eecce[_0x2683b4(0x161)]+=_0x49128b,_0x5eecce[_0x2683b4(0x161)]>_0x5eecce[_0x2683b4(0xda)]?(_0x3888bc[_0x2683b4(0x12e)]='',delete _0x3888bc[_0x2683b4(0xcc)]):_0x49128b>_0x25341f&&(_0x3888bc['capped']=_0x3888bc['value'][_0x2683b4(0x157)](0x0,_0x25341f),delete _0x3888bc[_0x2683b4(0xcc)]);}},_0x3c842b[_0x1bff5a(0x172)]['_isMap']=function(_0x23ed93){var _0x32ae70=_0x1bff5a;return!!(_0x23ed93&&_0x2a19ae[_0x32ae70(0x193)]&&this[_0x32ae70(0x127)](_0x23ed93)===_0x32ae70(0x117)&&_0x23ed93[_0x32ae70(0x180)]);},_0x3c842b['prototype'][_0x1bff5a(0x154)]=function(_0x539e6b){var _0x3e9eb6=_0x1bff5a;if(_0x539e6b['match'](/^\\d+$/))return _0x539e6b;var _0x268203;try{_0x268203=JSON[_0x3e9eb6(0xa8)](''+_0x539e6b);}catch{_0x268203='\\x22'+this['_objectToString'](_0x539e6b)+'\\x22';}return _0x268203[_0x3e9eb6(0x149)](/^\"([a-zA-Z_][a-zA-Z_0-9]*)\"$/)?_0x268203=_0x268203['substr'](0x1,_0x268203[_0x3e9eb6(0x10d)]-0x2):_0x268203=_0x268203['replace'](/'/g,'\\x5c\\x27')[_0x3e9eb6(0x11e)](/\\\\\"/g,'\\x22')[_0x3e9eb6(0x11e)](/(^\"|\"$)/g,'\\x27'),_0x268203;},_0x3c842b['prototype'][_0x1bff5a(0x115)]=function(_0x1b22e6,_0x139c74,_0x26c1fb,_0x18f60b){var _0x59810d=_0x1bff5a;this[_0x59810d(0x124)](_0x1b22e6,_0x139c74),_0x18f60b&&_0x18f60b(),this[_0x59810d(0x13c)](_0x26c1fb,_0x1b22e6),this[_0x59810d(0xdc)](_0x1b22e6,_0x139c74);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x124)]=function(_0x3de57f,_0x633f7e){var _0x3b15c7=_0x1bff5a;this[_0x3b15c7(0x120)](_0x3de57f,_0x633f7e),this['_setNodeQueryPath'](_0x3de57f,_0x633f7e),this[_0x3b15c7(0xaa)](_0x3de57f,_0x633f7e),this[_0x3b15c7(0x140)](_0x3de57f,_0x633f7e);},_0x3c842b['prototype'][_0x1bff5a(0x120)]=function(_0x212392,_0x5350c2){},_0x3c842b['prototype'][_0x1bff5a(0x15e)]=function(_0x254f19,_0xb65cfa){},_0x3c842b[_0x1bff5a(0x172)]['_setNodeLabel']=function(_0x5174e1,_0x4a4537){},_0x3c842b[_0x1bff5a(0x172)]['_isUndefined']=function(_0x4b9a4e){var _0x29d539=_0x1bff5a;return _0x4b9a4e===this[_0x29d539(0x9a)];},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xdc)]=function(_0x112fbe,_0xc2b2f8){var _0x13069a=_0x1bff5a;this[_0x13069a(0x122)](_0x112fbe,_0xc2b2f8),this[_0x13069a(0x118)](_0x112fbe),_0xc2b2f8[_0x13069a(0x168)]&&this[_0x13069a(0xcd)](_0x112fbe),this[_0x13069a(0x1a3)](_0x112fbe,_0xc2b2f8),this['_addLoadNode'](_0x112fbe,_0xc2b2f8),this['_cleanNode'](_0x112fbe);},_0x3c842b[_0x1bff5a(0x172)]['_additionalMetadata']=function(_0x480177,_0x5bf51c){var _0x36c251=_0x1bff5a;try{_0x480177&&typeof _0x480177[_0x36c251(0x10d)]==_0x36c251(0x113)&&(_0x5bf51c[_0x36c251(0x10d)]=_0x480177[_0x36c251(0x10d)]);}catch{}if(_0x5bf51c[_0x36c251(0x99)]===_0x36c251(0x113)||_0x5bf51c[_0x36c251(0x99)]==='Number'){if(isNaN(_0x5bf51c[_0x36c251(0xcc)]))_0x5bf51c[_0x36c251(0xf7)]=!0x0,delete _0x5bf51c[_0x36c251(0xcc)];else switch(_0x5bf51c['value']){case Number['POSITIVE_INFINITY']:_0x5bf51c['positiveInfinity']=!0x0,delete _0x5bf51c[_0x36c251(0xcc)];break;case Number[_0x36c251(0x18d)]:_0x5bf51c[_0x36c251(0x109)]=!0x0,delete _0x5bf51c[_0x36c251(0xcc)];break;case 0x0:this[_0x36c251(0xef)](_0x5bf51c[_0x36c251(0xcc)])&&(_0x5bf51c[_0x36c251(0xbb)]=!0x0);break;}}else _0x5bf51c[_0x36c251(0x99)]===_0x36c251(0x15c)&&typeof _0x480177[_0x36c251(0xe5)]==_0x36c251(0x13e)&&_0x480177[_0x36c251(0xe5)]&&_0x5bf51c[_0x36c251(0xe5)]&&_0x480177['name']!==_0x5bf51c[_0x36c251(0xe5)]&&(_0x5bf51c[_0x36c251(0xb8)]=_0x480177['name']);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xef)]=function(_0x5f59c6){var _0x3d7094=_0x1bff5a;return 0x1/_0x5f59c6===Number[_0x3d7094(0x18d)];},_0x3c842b[_0x1bff5a(0x172)]['_sortProps']=function(_0x341845){var _0xf1b50d=_0x1bff5a;!_0x341845['props']||!_0x341845[_0xf1b50d(0x17d)][_0xf1b50d(0x10d)]||_0x341845[_0xf1b50d(0x99)]===_0xf1b50d(0x111)||_0x341845['type']===_0xf1b50d(0x193)||_0x341845[_0xf1b50d(0x99)]===_0xf1b50d(0x11d)||_0x341845[_0xf1b50d(0x17d)]['sort'](function(_0x18e25d,_0x2e5ca7){var _0x5d8ea4=_0xf1b50d,_0x2086c0=_0x18e25d[_0x5d8ea4(0xe5)]['toLowerCase'](),_0x11bbd3=_0x2e5ca7[_0x5d8ea4(0xe5)]['toLowerCase']();return _0x2086c0<_0x11bbd3?-0x1:_0x2086c0>_0x11bbd3?0x1:0x0;});},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x1a3)]=function(_0x54949b,_0x4cb346){var _0x5e9777=_0x1bff5a;if(!(_0x4cb346[_0x5e9777(0x177)]||!_0x54949b[_0x5e9777(0x17d)]||!_0x54949b['props'][_0x5e9777(0x10d)])){for(var _0x4f6972=[],_0x78d8a8=[],_0x20bd98=0x0,_0x5628f1=_0x54949b['props'][_0x5e9777(0x10d)];_0x20bd98<_0x5628f1;_0x20bd98++){var _0x5c1147=_0x54949b[_0x5e9777(0x17d)][_0x20bd98];_0x5c1147[_0x5e9777(0x99)]===_0x5e9777(0x15c)?_0x4f6972[_0x5e9777(0x175)](_0x5c1147):_0x78d8a8[_0x5e9777(0x175)](_0x5c1147);}if(!(!_0x78d8a8['length']||_0x4f6972[_0x5e9777(0x10d)]<=0x1)){_0x54949b[_0x5e9777(0x17d)]=_0x78d8a8;var _0x1ffed3={'functionsNode':!0x0,'props':_0x4f6972};this[_0x5e9777(0x120)](_0x1ffed3,_0x4cb346),this[_0x5e9777(0x122)](_0x1ffed3,_0x4cb346),this[_0x5e9777(0x118)](_0x1ffed3),this['_setNodePermissions'](_0x1ffed3,_0x4cb346),_0x1ffed3['id']+='\\x20f',_0x54949b[_0x5e9777(0x17d)]['unshift'](_0x1ffed3);}}},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x10f)]=function(_0x3e2ffa,_0x7cf6a2){},_0x3c842b['prototype'][_0x1bff5a(0x118)]=function(_0x25a8d7){},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xf3)]=function(_0x1726d6){var _0x4469e7=_0x1bff5a;return Array[_0x4469e7(0x9b)](_0x1726d6)||typeof _0x1726d6==_0x4469e7(0x12d)&&this[_0x4469e7(0x127)](_0x1726d6)===_0x4469e7(0x19e);},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0x140)]=function(_0x4c1d3c,_0x349781){},_0x3c842b['prototype']['_cleanNode']=function(_0x4d21c1){var _0xd58577=_0x1bff5a;delete _0x4d21c1[_0xd58577(0xf5)],delete _0x4d21c1[_0xd58577(0x144)],delete _0x4d21c1[_0xd58577(0x110)];},_0x3c842b[_0x1bff5a(0x172)][_0x1bff5a(0xaa)]=function(_0x43e4e6,_0x3cf6da){};let _0x22e9d1=new _0x3c842b(),_0x31d042={'props':_0x483b0f[_0x1bff5a(0x16e)][_0x1bff5a(0x17d)]||0x64,'elements':_0x483b0f[_0x1bff5a(0x16e)][_0x1bff5a(0x163)]||0x64,'strLength':_0x483b0f[_0x1bff5a(0x16e)][_0x1bff5a(0xad)]||0x400*0x32,'totalStrLength':_0x483b0f['defaultLimits'][_0x1bff5a(0xda)]||0x400*0x32,'autoExpandLimit':_0x483b0f[_0x1bff5a(0x16e)][_0x1bff5a(0x194)]||0x1388,'autoExpandMaxDepth':_0x483b0f['defaultLimits'][_0x1bff5a(0xc0)]||0xa},_0x5134cc={'props':_0x483b0f[_0x1bff5a(0xbf)][_0x1bff5a(0x17d)]||0x5,'elements':_0x483b0f[_0x1bff5a(0xbf)][_0x1bff5a(0x163)]||0x5,'strLength':_0x483b0f[_0x1bff5a(0xbf)][_0x1bff5a(0xad)]||0x100,'totalStrLength':_0x483b0f['reducedLimits'][_0x1bff5a(0xda)]||0x100*0x3,'autoExpandLimit':_0x483b0f[_0x1bff5a(0xbf)][_0x1bff5a(0x194)]||0x1e,'autoExpandMaxDepth':_0x483b0f[_0x1bff5a(0xbf)]['autoExpandMaxDepth']||0x2};if(_0x599cd8){let _0x10c22a=_0x22e9d1[_0x1bff5a(0x16a)][_0x1bff5a(0x18c)](_0x22e9d1);_0x22e9d1[_0x1bff5a(0x16a)]=function(_0x63dc8a,_0xf87bc8,_0xed8b,_0x3030e4){return _0x10c22a(_0x63dc8a,_0x599cd8(_0xf87bc8),_0xed8b,_0x3030e4);};}function _0x36e6e0(_0x4b7ae2,_0x7448e6,_0x1e6871,_0x13e959,_0x54bcfa,_0x5e46fe){var _0x55e03f=_0x1bff5a;let _0x581fa4,_0x572fc2;try{_0x572fc2=_0x32f0dd(),_0x581fa4=_0x7f88c9[_0x7448e6],!_0x581fa4||_0x572fc2-_0x581fa4['ts']>_0x15035d['perLogpoint'][_0x55e03f(0xa9)]&&_0x581fa4['count']&&_0x581fa4[_0x55e03f(0x137)]/_0x581fa4[_0x55e03f(0xd3)]<_0x15035d['perLogpoint']['resetOnProcessingTimeAverageMs']?(_0x7f88c9[_0x7448e6]=_0x581fa4={'count':0x0,'time':0x0,'ts':_0x572fc2},_0x7f88c9[_0x55e03f(0x10c)]={}):_0x572fc2-_0x7f88c9[_0x55e03f(0x10c)]['ts']>_0x15035d[_0x55e03f(0xe6)][_0x55e03f(0xa9)]&&_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0xd3)]&&_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0x137)]/_0x7f88c9[_0x55e03f(0x10c)]['count']<_0x15035d[_0x55e03f(0xe6)][_0x55e03f(0x1a5)]&&(_0x7f88c9[_0x55e03f(0x10c)]={});let _0x592aa0=[],_0x201cd8=_0x581fa4['reduceLimits']||_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0xbc)]?_0x5134cc:_0x31d042,_0x1c3b41=_0x440706=>{var _0x380ff0=_0x55e03f;let _0x2fbc49={};return _0x2fbc49['props']=_0x440706['props'],_0x2fbc49['elements']=_0x440706[_0x380ff0(0x163)],_0x2fbc49['strLength']=_0x440706['strLength'],_0x2fbc49[_0x380ff0(0xda)]=_0x440706[_0x380ff0(0xda)],_0x2fbc49[_0x380ff0(0x194)]=_0x440706[_0x380ff0(0x194)],_0x2fbc49[_0x380ff0(0xc0)]=_0x440706[_0x380ff0(0xc0)],_0x2fbc49[_0x380ff0(0x168)]=!0x1,_0x2fbc49[_0x380ff0(0x177)]=!_0x447b71,_0x2fbc49[_0x380ff0(0x198)]=0x1,_0x2fbc49['level']=0x0,_0x2fbc49[_0x380ff0(0xfa)]=_0x380ff0(0xae),_0x2fbc49['rootExpression']=_0x380ff0(0x104),_0x2fbc49[_0x380ff0(0x169)]=!0x0,_0x2fbc49[_0x380ff0(0xf1)]=[],_0x2fbc49['autoExpandPropertyCount']=0x0,_0x2fbc49[_0x380ff0(0x102)]=_0x483b0f[_0x380ff0(0x102)],_0x2fbc49[_0x380ff0(0x161)]=0x0,_0x2fbc49[_0x380ff0(0x14e)]={'current':void 0x0,'parent':void 0x0,'index':0x0},_0x2fbc49;};for(var _0x34cb46=0x0;_0x34cb46<_0x54bcfa['length'];_0x34cb46++)_0x592aa0[_0x55e03f(0x175)](_0x22e9d1[_0x55e03f(0x16a)]({'timeNode':_0x4b7ae2==='time'||void 0x0},_0x54bcfa[_0x34cb46],_0x1c3b41(_0x201cd8),{}));if(_0x4b7ae2==='trace'||_0x4b7ae2===_0x55e03f(0x187)){let _0x38f028=Error['stackTraceLimit'];try{Error['stackTraceLimit']=0x1/0x0,_0x592aa0[_0x55e03f(0x175)](_0x22e9d1[_0x55e03f(0x16a)]({'stackNode':!0x0},new Error()['stack'],_0x1c3b41(_0x201cd8),{'strLength':0x1/0x0}));}finally{Error['stackTraceLimit']=_0x38f028;}}return{'method':_0x55e03f(0x17a),'version':_0x5161a5,'args':[{'ts':_0x1e6871,'session':_0x13e959,'args':_0x592aa0,'id':_0x7448e6,'context':_0x5e46fe}]};}catch(_0x38023d){return{'method':_0x55e03f(0x17a),'version':_0x5161a5,'args':[{'ts':_0x1e6871,'session':_0x13e959,'args':[{'type':_0x55e03f(0x114),'error':_0x38023d&&_0x38023d['message']}],'id':_0x7448e6,'context':_0x5e46fe}]};}finally{try{if(_0x581fa4&&_0x572fc2){let _0x4a1dc5=_0x32f0dd();_0x581fa4['count']++,_0x581fa4['time']+=_0x49b596(_0x572fc2,_0x4a1dc5),_0x581fa4['ts']=_0x4a1dc5,_0x7f88c9['hits'][_0x55e03f(0xd3)]++,_0x7f88c9['hits'][_0x55e03f(0x137)]+=_0x49b596(_0x572fc2,_0x4a1dc5),_0x7f88c9[_0x55e03f(0x10c)]['ts']=_0x4a1dc5,(_0x581fa4[_0x55e03f(0xd3)]>_0x15035d['perLogpoint'][_0x55e03f(0x138)]||_0x581fa4['time']>_0x15035d['perLogpoint'][_0x55e03f(0x148)])&&(_0x581fa4['reduceLimits']=!0x0),(_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0xd3)]>_0x15035d[_0x55e03f(0xe6)]['reduceOnCount']||_0x7f88c9[_0x55e03f(0x10c)][_0x55e03f(0x137)]>_0x15035d['global'][_0x55e03f(0x148)])&&(_0x7f88c9['hits'][_0x55e03f(0xbc)]=!0x0);}}catch{}}}return _0x36e6e0;}function G(_0x4bcced){var _0x3ca5c0=_0x1c43af;if(_0x4bcced&&typeof _0x4bcced==_0x3ca5c0(0x12d)&&_0x4bcced[_0x3ca5c0(0x19d)])switch(_0x4bcced[_0x3ca5c0(0x19d)][_0x3ca5c0(0xe5)]){case _0x3ca5c0(0xb0):return _0x4bcced[_0x3ca5c0(0xfc)](Symbol[_0x3ca5c0(0x189)])?Promise[_0x3ca5c0(0x18b)]():_0x4bcced;case _0x3ca5c0(0x19b):return Promise['resolve']();}return _0x4bcced;}((_0x48d785,_0x3c846c,_0x54e7b9,_0x233cc4,_0x4d1fbe,_0x5efe0f,_0xeb603e,_0x2e7e15,_0x351bad,_0x341637,_0x3428c5,_0x343bd6)=>{var _0x1125dc=_0x1c43af;if(_0x48d785[_0x1125dc(0xec)])return _0x48d785['_console_ninja'];let _0x3cd4f6={'consoleLog':()=>{},'consoleTrace':()=>{},'consoleTime':()=>{},'consoleTimeEnd':()=>{},'autoLog':()=>{},'autoLogMany':()=>{},'autoTraceMany':()=>{},'coverage':()=>{},'autoTrace':()=>{},'autoTime':()=>{},'autoTimeEnd':()=>{}};if(!X(_0x48d785,_0x2e7e15,_0x4d1fbe))return _0x48d785[_0x1125dc(0xec)]=_0x3cd4f6,_0x48d785[_0x1125dc(0xec)];let _0xaf0d67=b(_0x48d785),_0x281f2e=_0xaf0d67[_0x1125dc(0xb4)],_0xae8681=_0xaf0d67[_0x1125dc(0xfe)],_0x4e0fc5=_0xaf0d67['now'],_0xa2e8a7={'hits':{},'ts':{}},_0x91e1f5=J(_0x48d785,_0x351bad,_0xa2e8a7,_0x5efe0f,_0x343bd6,_0x4d1fbe===_0x1125dc(0x179)?G:void 0x0),_0x536854=(_0x530578,_0x31dfad,_0x4c757a,_0x143a26,_0x88e3a8,_0x4bf8d3)=>{var _0x348500=_0x1125dc;let _0x3306b6=_0x48d785['_console_ninja'];try{return _0x48d785[_0x348500(0xec)]=_0x3cd4f6,_0x91e1f5(_0x530578,_0x31dfad,_0x4c757a,_0x143a26,_0x88e3a8,_0x4bf8d3);}finally{_0x48d785[_0x348500(0xec)]=_0x3306b6;}},_0x11e42f=_0x3660d4=>{_0xa2e8a7['ts'][_0x3660d4]=_0xae8681();},_0x308a38=(_0x227f0b,_0x4baf5a)=>{var _0x286c56=_0x1125dc;let _0x459036=_0xa2e8a7['ts'][_0x4baf5a];if(delete _0xa2e8a7['ts'][_0x4baf5a],_0x459036){let _0xaca72e=_0x281f2e(_0x459036,_0xae8681());_0x223f4e(_0x536854(_0x286c56(0x137),_0x227f0b,_0x4e0fc5(),_0x3b9616,[_0xaca72e],_0x4baf5a));}},_0x11c122=_0x2d5a87=>{var _0x28fe2c=_0x1125dc,_0x1c2128;return _0x4d1fbe===_0x28fe2c(0x179)&&_0x48d785[_0x28fe2c(0xa3)]&&((_0x1c2128=_0x2d5a87==null?void 0x0:_0x2d5a87[_0x28fe2c(0x1a4)])==null?void 0x0:_0x1c2128[_0x28fe2c(0x10d)])&&(_0x2d5a87[_0x28fe2c(0x1a4)][0x0][_0x28fe2c(0xa3)]=_0x48d785['origin']),_0x2d5a87;};_0x48d785['_console_ninja']={'consoleLog':(_0x535a72,_0x3d708e)=>{var _0xee4f6a=_0x1125dc;_0x48d785['console'][_0xee4f6a(0x17a)][_0xee4f6a(0xe5)]!==_0xee4f6a(0xd2)&&_0x223f4e(_0x536854(_0xee4f6a(0x17a),_0x535a72,_0x4e0fc5(),_0x3b9616,_0x3d708e));},'consoleTrace':(_0x3cb025,_0x49aa51)=>{var _0x2f4b5c=_0x1125dc,_0x4599c8,_0x3c6c91;_0x48d785[_0x2f4b5c(0x159)][_0x2f4b5c(0x17a)][_0x2f4b5c(0xe5)]!==_0x2f4b5c(0x133)&&((_0x3c6c91=(_0x4599c8=_0x48d785[_0x2f4b5c(0xc5)])==null?void 0x0:_0x4599c8[_0x2f4b5c(0xe0)])!=null&&_0x3c6c91[_0x2f4b5c(0x14e)]&&(_0x48d785['_ninjaIgnoreNextError']=!0x0),_0x223f4e(_0x11c122(_0x536854(_0x2f4b5c(0x181),_0x3cb025,_0x4e0fc5(),_0x3b9616,_0x49aa51))));},'consoleError':(_0x1bcfbb,_0x5dfcc2)=>{var _0x5127a8=_0x1125dc;_0x48d785[_0x5127a8(0x121)]=!0x0,_0x223f4e(_0x11c122(_0x536854(_0x5127a8(0x187),_0x1bcfbb,_0x4e0fc5(),_0x3b9616,_0x5dfcc2)));},'consoleTime':_0x1240c5=>{_0x11e42f(_0x1240c5);},'consoleTimeEnd':(_0x45b15f,_0xedf120)=>{_0x308a38(_0xedf120,_0x45b15f);},'autoLog':(_0x476380,_0x430396)=>{var _0x381ac9=_0x1125dc;_0x223f4e(_0x536854(_0x381ac9(0x17a),_0x430396,_0x4e0fc5(),_0x3b9616,[_0x476380]));},'autoLogMany':(_0x496baf,_0x2de83e)=>{_0x223f4e(_0x536854('log',_0x496baf,_0x4e0fc5(),_0x3b9616,_0x2de83e));},'autoTrace':(_0x580506,_0xdd93fb)=>{var _0x545a58=_0x1125dc;_0x223f4e(_0x11c122(_0x536854(_0x545a58(0x181),_0xdd93fb,_0x4e0fc5(),_0x3b9616,[_0x580506])));},'autoTraceMany':(_0x35b68e,_0x1bf390)=>{var _0x53bd89=_0x1125dc;_0x223f4e(_0x11c122(_0x536854(_0x53bd89(0x181),_0x35b68e,_0x4e0fc5(),_0x3b9616,_0x1bf390)));},'autoTime':(_0x1f9f08,_0x36b878,_0x2bba7b)=>{_0x11e42f(_0x2bba7b);},'autoTimeEnd':(_0x5b5318,_0x42dbfa,_0x2fdc68)=>{_0x308a38(_0x42dbfa,_0x2fdc68);},'coverage':_0x3c7d3b=>{var _0x2e75e3=_0x1125dc;_0x223f4e({'method':_0x2e75e3(0x1a1),'version':_0x5efe0f,'args':[{'id':_0x3c7d3b}]});}};let _0x223f4e=H(_0x48d785,_0x3c846c,_0x54e7b9,_0x233cc4,_0x4d1fbe,_0x341637,_0x3428c5),_0x3b9616=_0x48d785[_0x1125dc(0x183)];return _0x48d785[_0x1125dc(0xec)];})(globalThis,_0x1c43af(0xd0),_0x1c43af(0x1a2),_0x1c43af(0x160),_0x1c43af(0xd8),'1.0.0',_0x1c43af(0x17b),_0x1c43af(0x14b),_0x1c43af(0x18a),'',_0x1c43af(0x156),{\"resolveGetters\":false,\"defaultLimits\":{\"props\":100,\"elements\":100,\"strLength\":51200,\"totalStrLength\":51200,\"autoExpandLimit\":5000,\"autoExpandMaxDepth\":10},\"reducedLimits\":{\"props\":5,\"elements\":5,\"strLength\":256,\"totalStrLength\":768,\"autoExpandLimit\":30,\"autoExpandMaxDepth\":2},\"reducePolicy\":{\"perLogpoint\":{\"reduceOnCount\":50,\"reduceOnAccumulatedProcessingTimeMs\":100,\"resetWhenQuietMs\":500,\"resetOnProcessingTimeAverageMs\":100},\"global\":{\"reduceOnCount\":1000,\"reduceOnAccumulatedProcessingTimeMs\":300,\"resetWhenQuietMs\":50,\"resetOnProcessingTimeAverageMs\":100}}});");
    } catch (e) {}
}
function oo_oo(i, ...v) {
    try {
        oo_cm().consoleLog(i, v);
    } catch (e) {}
    return v;
}
oo_oo; /* istanbul ignore next */ 
function oo_tr(i, ...v) {
    try {
        oo_cm().consoleTrace(i, v);
    } catch (e) {}
    return v;
}
oo_tr; /* istanbul ignore next */ 
function oo_tx(i, ...v) {
    try {
        oo_cm().consoleError(i, v);
    } catch (e) {}
    return v;
}
oo_tx; /* istanbul ignore next */ 
function oo_ts(v) {
    try {
        oo_cm().consoleTime(v);
    } catch (e) {}
    return v;
}
oo_ts; /* istanbul ignore next */ 
function oo_te(v, i) {
    try {
        oo_cm().consoleTimeEnd(v, i);
    } catch (e) {}
    return v;
}
oo_te; /*eslint unicorn/no-abusive-eslint-disable:,eslint-comments/disable-enable-pair:,eslint-comments/no-unlimited-disable:,eslint-comments/no-aggregating-enable:,eslint-comments/no-duplicate-disable:,eslint-comments/no-unused-disable:,eslint-comments/no-unused-enable:,*/ 
var _c;
__turbopack_context__.k.register(_c, "Chat");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/ChatInput.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ChatInput
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mic.mjs [app-client] (ecmascript) <export default as Mic>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/send.mjs [app-client] (ecmascript) <export default as Send>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$audio$2d$lines$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AudioLines$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/audio-lines.mjs [app-client] (ecmascript) <export default as AudioLines>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
function ChatInput({ onSend }) {
    _s();
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    function handleSubmit(event) {
        event.preventDefault();
        if (!message.trim()) {
            return;
        }
        onSend(message);
        setMessage("");
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "\n        border-t\n        border-[var(--border)]\n        bg-[var(--background)]\n        px-5 pb-5 pt-4\n      ",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "\n          mx-auto\n          flex\n          max-w-3xl\n          items-center\n          gap-2\n          rounded-2xl\n          border\n          border-[var(--input-border)]\n          bg-[var(--input-background)]\n          p-2\n          shadow-lg\n          transition-all duration-200\n          focus-within:border-[var(--border-hover)]\n        ",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        value: message,
                        onChange: (event)=>setMessage(event.target.value),
                        placeholder: "Converse com Athena...",
                        className: "\n            min-w-0\n            flex-1\n            bg-transparent\n            px-3\n            py-3\n            text-sm\n            text-[var(--foreground)]\n            outline-none\n            placeholder:text-[var(--foreground-muted)]\n          "
                    }, void 0, false, {
                        fileName: "[project]/src/components/ChatInput.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        className: "\n            flex h-10 w-10\n            shrink-0\n            items-center justify-center\n            rounded-xl\n            text-[var(--foreground-secondary)]\n            transition-all duration-200\n            hover:bg-[var(--sidebar-hover)]\n            hover:text-[var(--foreground)]\n          ",
                        title: "Falar com Athena",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__["Mic"], {
                            size: 19,
                            strokeWidth: 1.8
                        }, void 0, false, {
                            fileName: "[project]/src/components/ChatInput.tsx",
                            lineNumber: 89,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ChatInput.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "submit",
                        disabled: !message.trim(),
                        className: "\n            flex h-10 w-10\n            shrink-0\n            items-center justify-center\n            rounded-xl\n            bg-[var(--foreground)]\n            text-[var(--background)]\n            transition-all duration-200\n            hover:scale-105\n            disabled:cursor-not-allowed\n            disabled:opacity-30\n          ",
                        title: "Enviar mensagem",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$send$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Send$3e$__["Send"], {
                            size: 17,
                            strokeWidth: 2
                        }, void 0, false, {
                            fileName: "[project]/src/components/ChatInput.tsx",
                            lineNumber: 111,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/ChatInput.tsx",
                        lineNumber: 94,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/ChatInput.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "\n          mx-auto mt-3\n          flex max-w-3xl\n          justify-center\n        ",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    type: "button",
                    className: "\n            group\n            flex items-center gap-2\n            rounded-full\n            px-3 py-1.5\n            text-[11px]\n            text-[var(--foreground-muted)]\n            transition-all duration-200\n            hover:bg-[var(--sidebar-hover)]\n            hover:text-[var(--foreground-secondary)]\n          ",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$audio$2d$lines$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__AudioLines$3e$__["AudioLines"], {
                            size: 14,
                            strokeWidth: 1.8,
                            className: "\n              transition-transform duration-200\n              group-hover:scale-110\n            "
                        }, void 0, false, {
                            fileName: "[project]/src/components/ChatInput.tsx",
                            lineNumber: 140,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Conversar por voz"
                        }, void 0, false, {
                            fileName: "[project]/src/components/ChatInput.tsx",
                            lineNumber: 149,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/ChatInput.tsx",
                    lineNumber: 126,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/ChatInput.tsx",
                lineNumber: 119,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "\n          mt-2\n          text-center\n          text-[10px]\n          text-[var(--foreground-muted)]\n        ",
                children: "A IA pode cometer erros. Verifique informações importantes."
            }, void 0, false, {
                fileName: "[project]/src/components/ChatInput.tsx",
                lineNumber: 155,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ChatInput.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_s(ChatInput, "EiOGSxO4GWQlH0sM782nQ9JwuAs=");
_c = ChatInput;
var _c;
__turbopack_context__.k.register(_c, "ChatInput");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/Sidebar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Sidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.mjs [app-client] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-client] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$kanban$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderKanban$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder-kanban.mjs [app-client] (ecmascript) <export default as FolderKanban>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GraduationCap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/graduation-cap.mjs [app-client] (ecmascript) <export default as GraduationCap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Monitor$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/monitor.mjs [app-client] (ecmascript) <export default as Monitor>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$close$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftClose$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/panel-left-close.mjs [app-client] (ecmascript) <export default as PanelLeftClose>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftOpen$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/panel-left-open.mjs [app-client] (ecmascript) <export default as PanelLeftOpen>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.mjs [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.mjs [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$computer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Computer$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/computer.mjs [app-client] (ecmascript) <export default as Computer>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/ThemeProvider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
const menuItems = [
    {
        label: "Nova conversa",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"]
    },
    {
        label: "Chat",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"]
    },
    {
        label: "API",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$computer$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Computer$3e$__["Computer"]
    },
    {
        label: "Pesquisar",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"]
    },
    {
        label: "Projetos",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2d$kanban$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FolderKanban$3e$__["FolderKanban"]
    },
    {
        label: "Aprender",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$graduation$2d$cap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__GraduationCap$3e$__["GraduationCap"]
    },
    {
        label: "Meu PC",
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$monitor$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Monitor$3e$__["Monitor"]
    }
];
function Sidebar({ isOpen, onToggle }) {
    _s();
    const { theme, toggleTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"])();
    const isDark = theme === "dark";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: `
        relative flex h-screen shrink-0 flex-col
        border-r
        border-[var(--sidebar-border)]
        bg-[var(--sidebar-background)]
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-64" : "w-[72px]"}
      `,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `
          flex h-20 items-center
          border-b
          border-[var(--sidebar-border)]
          px-4
          ${isOpen ? "justify-between" : "justify-center"}
        `,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `
            flex items-center gap-2
            overflow-hidden
            transition-all duration-300
            ${isOpen ? "w-auto opacity-100" : "w-0 opacity-0"}
          `,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "/assets/LOGO.png",
                                alt: "SAITE",
                                className: "h-12 w-auto object-contain"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Sidebar.tsx",
                                lineNumber: 95,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                src: "/assets/TITULO.png",
                                alt: "SAITE",
                                className: "h-25 w-auto object-contain"
                            }, void 0, false, {
                                fileName: "[project]/src/components/Sidebar.tsx",
                                lineNumber: 101,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/Sidebar.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onToggle,
                        "aria-label": isOpen ? "Fechar menu" : "Abrir menu",
                        className: "\n            flex h-9 w-9 shrink-0\n            items-center justify-center\n            rounded-lg\n            text-[var(--foreground-secondary)]\n            transition-all duration-200\n            hover:bg-[var(--sidebar-hover)]\n            hover:text-[var(--foreground)]\n          ",
                        children: isOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$close$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftClose$3e$__["PanelLeftClose"], {
                            size: 19,
                            strokeWidth: 1.8
                        }, void 0, false, {
                            fileName: "[project]/src/components/Sidebar.tsx",
                            lineNumber: 124,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$panel$2d$left$2d$open$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__PanelLeftOpen$3e$__["PanelLeftOpen"], {
                            size: 19,
                            strokeWidth: 1.8
                        }, void 0, false, {
                            fileName: "[project]/src/components/Sidebar.tsx",
                            lineNumber: 126,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/Sidebar.tsx",
                        lineNumber: 110,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/Sidebar.tsx",
                lineNumber: 76,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "\n          flex flex-1 flex-col\n          gap-1\n          overflow-hidden\n          px-3 py-5\n        ",
                children: menuItems.map((item)=>{
                    const Icon = item.icon;
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: `
                group
                flex h-11
                items-center
                rounded-xl
                text-sm
                text-[var(--foreground-secondary)]
                transition-all duration-200
                hover:bg-[var(--sidebar-hover)]
                hover:text-[var(--foreground)]
                ${isOpen ? "gap-3 px-3" : "justify-center px-0"}
              `,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                size: 19,
                                strokeWidth: 1.8,
                                className: "\n                  shrink-0\n                  transition-transform\n                  duration-200\n                  group-hover:scale-105\n                "
                            }, void 0, false, {
                                fileName: "[project]/src/components/Sidebar.tsx",
                                lineNumber: 162,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `
                  overflow-hidden
                  whitespace-nowrap
                  transition-all duration-200
                  ${isOpen ? "w-auto opacity-100" : "w-0 opacity-0"}
                `,
                                children: item.label
                            }, void 0, false, {
                                fileName: "[project]/src/components/Sidebar.tsx",
                                lineNumber: 173,
                                columnNumber: 15
                            }, this)
                        ]
                    }, item.label, true, {
                        fileName: "[project]/src/components/Sidebar.tsx",
                        lineNumber: 147,
                        columnNumber: 13
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/components/Sidebar.tsx",
                lineNumber: 135,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "\n    flex\n    items-center\n    justify-center\n    border-t\n    border-[var(--sidebar-border)]\n    p-3\n  ",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: toggleTheme,
                    "aria-label": isDark ? "Mudar para modo claro" : "Mudar para modo escuro",
                    title: isDark ? "Modo claro" : "Modo escuro",
                    className: "\n      group\n      flex h-11 w-11\n      items-center\n      justify-center\n      rounded-xl\n      bg-[var(--sidebar-background)]\n      text-[var(--foreground-secondary)]\n      transition-all duration-200\n      hover:bg-[var(--sidebar-hover)]\n      hover:text-[var(--foreground)]\n    ",
                    children: isDark ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                        size: 19,
                        strokeWidth: 1.8,
                        className: "\n          transition-transform\n          duration-300\n          group-hover:rotate-12\n        "
                    }, void 0, false, {
                        fileName: "[project]/src/components/Sidebar.tsx",
                        lineNumber: 221,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                        size: 19,
                        strokeWidth: 1.8,
                        className: "\n          transition-transform\n          duration-300\n          group-hover:rotate-45\n        "
                    }, void 0, false, {
                        fileName: "[project]/src/components/Sidebar.tsx",
                        lineNumber: 231,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/Sidebar.tsx",
                    lineNumber: 201,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/Sidebar.tsx",
                lineNumber: 191,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/Sidebar.tsx",
        lineNumber: 62,
        columnNumber: 5
    }, this);
}
_s(Sidebar, "Q4eAjrIZ0CuRuhycs6byifK2KBk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$ThemeProvider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useTheme"]
    ];
});
_c = Sidebar;
var _c;
__turbopack_context__.k.register(_c, "Sidebar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "sendMessage",
    ()=>sendMessage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const API_URL = ("TURBOPACK compile-time value", "http://localhost:8000") || "http://localhost:8000";
async function sendMessage(message) {
    const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message
        })
    });
    if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
    }
    const data = await response.json();
    return data.response;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_0n286sk._.js.map