importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

workbox.routing.registerRoute( /\.(?:js|json)$/,
	new workbox.strategies.NetworkFirst()
);

workbox.routing.registerRoute( /\.css$/,
	new workbox.strategies.StaleWhileRevalidate() );

workbox.routing.registerRoute( /\.(?:png|jpg|jpeg|gif|svg)$/,
new workbox.strategies.CacheFirst() );