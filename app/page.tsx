export default function DashboardPage() {
	return (
		<div className='space-y-6'>
			<div className='flex items-center justify-between'>
				<h1 className='text-2xl font-bold tracking-tight text-gray-900'>
					Dashboard
				</h1>
			</div>

			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
				<div className='rounded-xl border bg-card text-card-foreground shadow p-6'>
					<div className='text-sm font-medium text-gray-500'>Total Revenue</div>
					<div className='text-2xl font-bold'>$45,231.89</div>
				</div>
				<div className='rounded-xl border bg-card text-card-foreground shadow p-6'>
					<div className='text-sm font-medium text-gray-500'>Active Users</div>
					<div className='text-2xl font-bold'>+2350</div>
				</div>
			</div>
		</div>
	)
}
