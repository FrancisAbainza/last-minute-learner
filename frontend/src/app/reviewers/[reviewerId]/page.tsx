type ReviewerPageProp = {
  params: Promise<{ reviewerId: string }>
}

export default async function ReviewerPage({ params }: ReviewerPageProp) {
  const { reviewerId } = await params;
  return (
    <div>{reviewerId}</div>
  );
}