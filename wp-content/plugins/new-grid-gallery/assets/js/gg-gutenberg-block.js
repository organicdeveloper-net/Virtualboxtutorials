(function(blocks, blockEditor, element, components) {
    'use strict';

    var el = element.createElement;
    var registerBlockType = blocks.registerBlockType;
    var InspectorControls = blockEditor.InspectorControls;
    var useBlockProps = blockEditor.useBlockProps;
    var SelectControl = components.SelectControl;
    var PanelBody = components.PanelBody;
    var Disabled = components.Disabled;
    var ServerSideRender = wp.serverSideRender;

    registerBlockType('new-grid-gallery/gallery-select', {
        apiVersion: 3,
        title: 'Grid Gallery',
        description: 'Display an individual grid gallery.',
        icon: 'grid-view',
        category: 'widgets',
        attributes: {
            galleryId: {
                type: 'string',
                default: ''
            }
        },

        edit: function(props) {
            var attributes = props.attributes;
            var setAttributes = props.setAttributes;
            var blockProps = useBlockProps();

            // Load localized galleries
            var gData = window.ggp_gutenberg_data || { galleries: [] };
            
            // Build galleries list
            var galleryOptions = [{ label: '-- Select Gallery --', value: '' }];
            gData.galleries.forEach(function(g) {
                galleryOptions.push({ label: g.title + ' (ID: ' + g.id + ')', value: g.id.toString() });
            });

            // Gallery selector control
            var gallerySelector = el(SelectControl, {
                label: 'Choose Grid Gallery',
                value: attributes.galleryId,
                options: galleryOptions,
                onChange: function(value) {
                    setAttributes({ galleryId: value });
                }
            });

            // Build the editor view
            var editorContent;

            if (attributes.galleryId) {
                // Live preview using ServerSideRender
                editorContent = el('div', { style: { pointerEvents: 'none', display: 'flow-root' } },
                    el(Disabled, {},
                        el(ServerSideRender, {
                            block: 'new-grid-gallery/gallery-select',
                            attributes: attributes
                        })
                    )
                );
            } else {
                // Placeholder when no gallery is selected
                editorContent = el('div', {
                    style: {
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        color: '#ffffff',
                        padding: '30px 25px',
                        borderRadius: '12px',
                        textAlign: 'center',
                        boxShadow: '0 4px 15px rgba(79, 70, 229, 0.15)',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
                    }
                },
                    el('span', { className: 'dashicons dashicons-grid-view', style: { fontSize: '36px', width: '36px', height: '36px', marginBottom: '12px', color: '#a78bfa', display: 'block' } }),
                    el('h4', { style: { margin: '0 0 10px 0', fontSize: '16px', fontWeight: '700', color: '#ffffff' } }, 'Grid Gallery Block'),
                    el('p', { style: { margin: '0 0 16px 0', opacity: 0.85, fontSize: '13px', color: '#c084fc' } }, 
                        'Select a gallery to display.'
                    ),
                    el('div', { style: { maxWidth: '300px', margin: '0 auto', textAlign: 'left' } },
                        el(SelectControl, {
                            value: attributes.galleryId,
                            options: galleryOptions,
                            onChange: function(value) {
                                setAttributes({ galleryId: value });
                            }
                        })
                    )
                );
            }

            return el('div', blockProps,
                // Sidebar Inspector controls
                el(InspectorControls, {},
                    el(PanelBody, { title: 'Gallery Display Settings', initialOpen: true },
                        gallerySelector
                    )
                ),
                editorContent
            );
        },

        save: function() {
            return null;
        }
    });
})(
    window.wp.blocks,
    window.wp.blockEditor,
    window.wp.element,
    window.wp.components
);
