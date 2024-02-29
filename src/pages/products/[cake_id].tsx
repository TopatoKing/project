import { useRouter } from 'next/router';
import { db } from '@/server/db';
import { GetServerSideProps } from 'next';
import type { Cakes } from '@prisma/client';
import Image from 'next/image';

interface FinalCake extends Cakes {
    CakeAllergens: {
        AllergenID: number;
        Allergens: {
            AllergenName: string;
        };
    }[];
}


export default function SearchPage({ theCake }: { theCake: FinalCake }) {

    return (
        <main className="flex">
            <nav className="w-[40%] min-h-[60dvh] mx-4">
                <Image src={`/cakes/${theCake.CakeStringID}.jpg`} alt={theCake.Type} width={300} height={300} className='justify-center w-full mt-12 rounded-lg' />
                <h2 className="text-2xl font-bold text-center">{theCake.Type}</h2>
                {theCake.CakeAllergens.length > 0 && (
                    <div className="flex flex-col items-center">
                        <h3 className="text-xl font-bold">Allergens:</h3>
                        <ul className="list-disc">
                            {theCake.CakeAllergens.map((allergen) => (
                                <li key={allergen.AllergenID}>{allergen.Allergens.AllergenName}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </nav>
            <div className="border-l-2 border-[#57b0fe] h-[65dvh]"/>
            <section className="w-[60%] min-h-[60dvh] mx-4">
                

            </section>
        </main>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { cake_id } = context.query;

    if (!cake_id || isNaN(parseInt(cake_id as string, 10))) {
        return {
            notFound: true,
        };
    }

    const theCake = await db.cakes.findUnique({
        where: {
            CakeID: parseInt(cake_id as string, 10),
        },
        include: {
            CakeAllergens: {
                include: {
                    Allergens: true,
                },
            },
        },
    });
    console.log(theCake);

    if (!theCake) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            theCake,
        },
    };
}
