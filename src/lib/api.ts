import { PUBLIC_MF_CORE_BASE_URL } from '$env/static/public';
import { error } from '@sveltejs/kit';

interface HeadersOption {
	'Content-Type'?: string;
	Authorization?: string;
}

interface FetchOptions {
	method: string;
	headers?: HeadersOption;
	body?: string;
}
const base = PUBLIC_MF_CORE_BASE_URL;
const isAbsoluteUrl = (str: string) => {
	// eslint-disable-next-line no-useless-escape
	const url = str.match(/^(([a-z]+:)?(\/\/)?[^\/]+\/).*$/);

	return url && url.length > 0 ? true : false;
};

async function send({
	method,
	path,
	data,
	locals
}: {
	method: string;
	path: string;
	data?: any;
	locals: Locale;
}) {
	const opts: RequestInit = { method };
	const headersInit: HeadersInit = {};
	opts.headers = headersInit;

	const { token } = locals;

	if (data) {
		opts.headers['Content-Type'] = 'application/json';
		opts.body = JSON.stringify(data);
	}

	if (token) {
		opts.headers['authorization'] = `Bearer ${token}`;
		opts.headers['usertype'] = locals.userType;
		opts.headers['accounttype'] = locals.accountType;
	}
	const baseUrl = isAbsoluteUrl(path) ? path : `${base}/${path}`;

	const res = await fetch(baseUrl, opts);

	if (res.ok) {
		const text = await res.text();
		return text ? JSON.parse(text) : {};
	}

	throw error(res.status);
}

export function get(path: string, locals: Locale) {
	return send({ method: 'GET', path, locals });
}

export function del(path: string, locals: Locale) {
	return send({ method: 'DELETE', path, locals });
}

export function post(path: string, data, locals: Locale) {
	return send({ method: 'POST', path, data, locals });
}

export function put(path: string, data, locals: Locale) {
	return send({ method: 'PUT', path, data, locals });
}
