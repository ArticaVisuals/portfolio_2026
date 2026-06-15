import{jsx as _jsx}from"react/jsx-runtime";import{addPropertyControls,ControlType}from"framer";/**
 * Responsive Case Study Image
 *
 * @framerIntrinsicWidth 1600
 * @framerIntrinsicHeight 900
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */export default function ResponsiveCaseStudyImage(props){const{src,alt,ratio,style}=props;return /*#__PURE__*/_jsx("div",{style:{...style,width:"100%",height:"auto",aspectRatio:ratio,display:"block",overflow:"hidden",background:"transparent"},children:/*#__PURE__*/_jsx("img",{src:src,alt:alt,loading:"lazy",style:{display:"block",width:"100%",height:"100%",objectFit:"contain",background:"transparent"}})});}addPropertyControls(ResponsiveCaseStudyImage,{src:{type:ControlType.String,title:"Source",defaultValue:""},alt:{type:ControlType.String,title:"Alt",defaultValue:"Case study image"},ratio:{type:ControlType.Number,title:"Ratio",defaultValue:1.7777777778,min:.2,max:4,step:.01}});
export const __FramerMetadata__ = {"exports":{"default":{"type":"reactComponent","name":"ResponsiveCaseStudyImage","slots":[],"annotations":{"framerIntrinsicHeight":"900","framerIntrinsicWidth":"1600","framerSupportedLayoutWidth":"any","framerSupportedLayoutHeight":"any","framerContractVersion":"1"}},"__FramerMetadata__":{"type":"variable"}}}
//# sourceMappingURL=./ResponsiveCaseStudyImage.map