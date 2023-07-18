<script lang="ts">
	import { base } from '$app/paths';

	interface Stories {
		thumbnails: string;
		title: string;
		id: string;
	}

	const stories: Array<Stories> = [
		{
			thumbnails:
				'https://scontent.fblr20-1.fna.fbcdn.net/v/t39.30808-6/336479927_878247466575137_7231191351642094300_n.jpg?stp=dst-jpg_p320x320&_nc_cat=1&ccb=1-7&_nc_sid=f7b297&_nc_ohc=urGmsMdaF5gAX8KPQKw&_nc_ht=scontent.fblr20-1.fna&oh=00_AfBKxZas92BMiKkiPVQvEMPIlLMekgtl1bxhR1cEjR2-VA&oe=641DE261',
			title: 'Best Returns',
			id: 'abcd-1'
		},
		{
			thumbnails:
				'https://scontent.fblr20-1.fna.fbcdn.net/v/t39.30808-6/336479927_878247466575137_7231191351642094300_n.jpg?stp=dst-jpg_p320x320&_nc_cat=1&ccb=1-7&_nc_sid=f7b297&_nc_ohc=urGmsMdaF5gAX8KPQKw&_nc_ht=scontent.fblr20-1.fna&oh=00_AfBKxZas92BMiKkiPVQvEMPIlLMekgtl1bxhR1cEjR2-VA&oe=641DE261',
			title: 'Best Returns',
			id: 'abcd-2'
		},
		{
			thumbnails:
				'https://scontent.fblr20-1.fna.fbcdn.net/v/t39.30808-6/336479927_878247466575137_7231191351642094300_n.jpg?stp=dst-jpg_p320x320&_nc_cat=1&ccb=1-7&_nc_sid=f7b297&_nc_ohc=urGmsMdaF5gAX8KPQKw&_nc_ht=scontent.fblr20-1.fna&oh=00_AfBKxZas92BMiKkiPVQvEMPIlLMekgtl1bxhR1cEjR2-VA&oe=641DE261',
			title: 'Best Returns',
			id: 'abcd-3'
		},
		{
			thumbnails:
				'https://scontent.fblr20-1.fna.fbcdn.net/v/t39.30808-6/336479927_878247466575137_7231191351642094300_n.jpg?stp=dst-jpg_p320x320&_nc_cat=1&ccb=1-7&_nc_sid=f7b297&_nc_ohc=urGmsMdaF5gAX8KPQKw&_nc_ht=scontent.fblr20-1.fna&oh=00_AfBKxZas92BMiKkiPVQvEMPIlLMekgtl1bxhR1cEjR2-VA&oe=641DE261',
			title: 'Best Returns',
			id: 'abcd-4'
		},
		{
			thumbnails:
				'https://scontent.fblr20-1.fna.fbcdn.net/v/t39.30808-6/336479927_878247466575137_7231191351642094300_n.jpg?stp=dst-jpg_p320x320&_nc_cat=1&ccb=1-7&_nc_sid=f7b297&_nc_ohc=urGmsMdaF5gAX8KPQKw&_nc_ht=scontent.fblr20-1.fna&oh=00_AfBKxZas92BMiKkiPVQvEMPIlLMekgtl1bxhR1cEjR2-VA&oe=641DE261',
			title: 'Best Returns',
			id: 'abcd-5'
		},
		{
			thumbnails:
				'https://scontent.fblr20-1.fna.fbcdn.net/v/t39.30808-6/336479927_878247466575137_7231191351642094300_n.jpg?stp=dst-jpg_p320x320&_nc_cat=1&ccb=1-7&_nc_sid=f7b297&_nc_ohc=urGmsMdaF5gAX8KPQKw&_nc_ht=scontent.fblr20-1.fna&oh=00_AfBKxZas92BMiKkiPVQvEMPIlLMekgtl1bxhR1cEjR2-VA&oe=641DE261',
			title: 'Best Returns',
			id: 'abcd-6'
		}
	];
</script>

<article class="flex overflow-scroll bg-white px-4 py-3">
	{#each stories || [] as story}
		<div class="mr-8 flex flex-col">
			<label for="story-modal">
				<div
					class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-r-2 border-blue-primary"
				>
					<div class="flex h-14 w-14 overflow-hidden rounded-full">
						<img
							src={`${base}/images/Story_Investments.png`}
							alt={story.title}
							class="m-auto inline h-full w-auto"
						/>
					</div>
				</div>
			</label>
			<div class="text-[10px] font-medium text-black-title">{story.title}</div>
		</div>
	{/each}
</article>

<input type="checkbox" id="story-modal" class="modal-toggle" />
<div class="modal">
	<div class="modal-box">
		<div class="modal-action">
			<label for="story-modal" class="btn">Yay!</label>
		</div>
	</div>
</div>
